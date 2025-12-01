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
import debounce from '../debounce';
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
    const deactivateOnScrollStart = useStableCallback(() => {
      isOnScrollStartCalledRef.current = false;
    });
    const maybeCallOnScrollStart = useStableCallback(() => {
      if (!isOnScrollStartCalledRef.current) {
        onScrollStartStable();
        isOnScrollStartCalledRef.current = true;
      }
    });
    const onScrollEndStable = useStableCallback(() => {
      maybeCallOnScrollStart();
      onScrollEndProp?.();
      deactivateOnScrollStart();
    });
    const onScrollEnd = useMemo(
      () => debounce(onScrollEndStable, 100),
      // A small delay is needed so that onScrollEnd doesn't trigger prematurely.
      [onScrollEndStable],
    );
    const onScrollBeginDrag = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        maybeCallOnScrollStart();
        onScrollBeginDragProp?.(args);
      },
    );
    const onScrollEndDrag = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollEndDragProp?.(args);
        onScrollEnd();
      },
    );
    const onMomentumScrollBegin = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        maybeCallOnScrollStart();
        onScrollEnd.clear();
        onMomentumScrollBeginProp?.(args);
      },
    );
    const onMomentumScrollEnd = useStableCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onMomentumScrollEndProp?.(args);
        onScrollEnd();
      },
    );
    useEffect(() => {
      const sub = scrollOffset.addListener(() => {
        if (!isOnScrollStartCalledRef.current) {
          // If this condition is met, then we assume that no events were triggered,
          // and there was a change in the content that offset shifted to a smaller side
          maybeCallOnScrollStart();
          onScrollEnd();
        } else {
          onScrollEnd.clear();
        }
      });
      return () => {
        scrollOffset.removeListener(sub);
      };
    }, [maybeCallOnScrollStart, onScrollEnd, scrollOffset]);
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
