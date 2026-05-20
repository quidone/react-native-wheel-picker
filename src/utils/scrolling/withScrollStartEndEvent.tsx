import React, {
  type ComponentRef,
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import debounce from '@utils/debounce';

type ComponentProps = Pick<
  ScrollViewProps,
  | 'onScrollBeginDrag'
  | 'onScrollEndDrag'
  | 'onMomentumScrollBegin'
  | 'onMomentumScrollEnd'
>;

type ExtendProps<PropsT> = PropsT & {
  scrollOffset: Animated.Value;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
};

const withScrollStartEndEvent = <PropsT extends ComponentProps>(
  Component: ComponentType<PropsT>,
) => {
  const Wrapper = (
    {
      onScrollStart: onScrollStartProp,
      onScrollEnd: onScrollEndProp,
      onScrollBeginDrag: onScrollBeginDragProp,
      onScrollEndDrag: onScrollEndDragProp,
      onMomentumScrollBegin: onMomentumScrollBeginProp,
      onMomentumScrollEnd: onMomentumScrollEndProp,
      scrollOffset,
      ...rest
    }: ExtendProps<PropsT>,
    forwardedRef: ForwardedRef<ComponentRef<ComponentType<PropsT>>>,
  ) => {
    const onScrollStartStable = useStableCallback(onScrollStartProp);

    const isOnScrollStartCalledRef = useRef(false);
    /*
     * `isImplicitScrollRef` marks a scroll session that was detected from
     * `contentOffset` updates only, without a native start callback.
     *
     * Why this exists:
     * Android may perform a programmatic animated scroll
     * (`scrollTo` / `scrollToIndex`) and emit several offset updates while
     * skipping the normal callback pair that we usually rely on:
     * `onScrollBeginDrag` / `onScrollEndDrag` and
     * `onMomentumScrollBegin` / `onMomentumScrollEnd`.
     *
     * Relevant React Native issues:
     * https://github.com/facebook/react-native/issues/11693
     * https://github.com/facebook/react-native/issues/19246
     * https://github.com/facebook/react-native/issues/25672
     * https://github.com/facebook/react-native/issues/26661
     *
     * In this library it shows up when one wheel triggers a synchronized
     * animated scroll in another wheel. Example sequence on Android:
     * - offset changes: 48 -> 47.6 -> 46.0 -> 43.4 -> ... -> 0
     * - but no native "begin/end" events are dispatched for that movement
     *
     * Old failure mode:
     * - the first offset update inferred scroll start and scheduled a debounced
     *   scroll end
     * - the next offset updates only cleared that debounced end
     * - because Android never sent a native end event, the session stayed
     *   "started" forever
     * - `PickerControl` then kept one picker in `isStopped = false`, so the
     *   aggregated DatePicker `onDateChanged` stopped firing
     *
     * We still emit `onScrollStart` for such a session, but we must finish it
     * differently: if the session is implicit, every offset update should
     * re-arm the debounced end so that the last offset update wins and the
     * scroll eventually ends even when Android never gives us a native end
     * callback.
     *
     * Related library issues:
     * https://github.com/quidone/react-native-wheel-picker/issues/56
     * https://github.com/quidone/react-native-wheel-picker/issues/71
     */
    const isImplicitScrollRef = useRef(false);
    const deactivateOnScrollStart = useStableCallback(() => {
      isOnScrollStartCalledRef.current = false;
      isImplicitScrollRef.current = false;
    });
    const maybeCallOnScrollStart = useStableCallback(
      ({implicit}: {implicit: boolean}) => {
        const shouldActivate = !isOnScrollStartCalledRef.current;
        if (shouldActivate) {
          onScrollStartStable();
          isOnScrollStartCalledRef.current = true;
          isImplicitScrollRef.current = implicit;
          return;
        }

        if (!implicit) {
          isImplicitScrollRef.current = false;
        }
      },
    );

    const maybeCallOnNativeScrollStart = useStableCallback(() => {
      maybeCallOnScrollStart({implicit: false});
    });
    const maybeCallOnImplicitScrollStart = useStableCallback(() => {
      maybeCallOnScrollStart({implicit: true});
    });

    const onScrollEndStable = useStableCallback(() => {
      maybeCallOnNativeScrollStart();
      onScrollEndProp?.();
      deactivateOnScrollStart();
    });

    const onScrollEnd = useMemo(
      () => debounce(onScrollEndStable, 100), // A small delay is needed so that onScrollEnd doesn't trigger prematurely.
      [onScrollEndStable],
    );

    const onScrollBeginDrag = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        maybeCallOnNativeScrollStart();
        onScrollBeginDragProp?.(args);
      },
    );

    const onScrollEndDrag = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollEndDragProp?.(args);
        onScrollEnd();
      },
    );

    const hasMomentumScrollEndedRef = useRef(false);
    const onMomentumScrollBegin = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        hasMomentumScrollEndedRef.current = false;
        maybeCallOnNativeScrollStart();
        onScrollEnd.clear();
        onMomentumScrollBeginProp?.(args);
      },
    );

    const onMomentumScrollEnd = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        hasMomentumScrollEndedRef.current = true;
        onMomentumScrollEndProp?.(args);
        onScrollEnd();
      },
    );

    useEffect(() => {
      const sub = scrollOffset.addListener(() => {
        if (!isOnScrollStartCalledRef.current) {
          maybeCallOnImplicitScrollStart();
          onScrollEnd();
          return;
        }

        if (isImplicitScrollRef.current) {
          onScrollEnd();
        } else if(!hasMomentumScrollEndedRef.current) {
          onScrollEnd.clear();
        }
      });
      return () => {
        scrollOffset.removeListener(sub);
      };
    }, [maybeCallOnImplicitScrollStart, onScrollEnd, scrollOffset]);

    return (
      <Component
        {...(rest as any)}
        ref={forwardedRef}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    );
  };

  Wrapper.displayName = `withScrollStartEndEvent(${
    Component.displayName || 'Component'
  })`;

  return memo(
    forwardRef<ComponentRef<ComponentType<PropsT>>, ExtendProps<PropsT>>(
      Wrapper as any,
    ),
  );
};

export default withScrollStartEndEvent;
