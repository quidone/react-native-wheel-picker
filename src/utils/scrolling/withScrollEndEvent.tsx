import React, {
  type ComponentRef,
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
} from 'react-native';
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
  onScrollEnd?: () => void;
};

const withScrollEndEvent = <PropsT extends ComponentProps>(
  Component: ComponentType<PropsT>,
) => {
  const Wrapper = (
    {
      onScrollEnd: onScrollEndProp = () => {},
      onScrollEndDrag: onScrollEndDragProp,
      onMomentumScrollBegin: onMomentumScrollBeginProp,
      onMomentumScrollEnd: onMomentumScrollEndProp,
      scrollOffset,
      ...rest
    }: ExtendProps<PropsT>,
    forwardedRef: ForwardedRef<ComponentRef<ComponentType<PropsT>>>,
  ) => {
    const onScrollEnd = useMemo(
      () => debounce(onScrollEndProp, 100), // A small delay is needed so that onScrollEnd doesn't trigger prematurely.
      [onScrollEndProp],
    );

    const onScrollEndDrag = useCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollEndDragProp?.(args);
        onScrollEnd();
      },
      [onScrollEnd, onScrollEndDragProp],
    );

    const onMomentumScrollBegin = useCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onScrollEnd.clear();
        onMomentumScrollBeginProp?.(args);
      },
      [onScrollEnd, onMomentumScrollBeginProp],
    );

    const onMomentumScrollEnd = useCallback(
      (args: NativeSyntheticEvent<NativeScrollEvent>) => {
        onMomentumScrollEndProp?.(args);
        onScrollEnd();
      },
      [onScrollEnd, onMomentumScrollEndProp],
    );

    useEffect(() => {
      const sub = scrollOffset.addListener(() => {
        onScrollEnd.clear();
      });
      return () => {
        scrollOffset.removeListener(sub);
      };
    }, [onScrollEnd, scrollOffset]);

    return (
      <Component
        {...(rest as any)}
        ref={forwardedRef}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />
    );
  };

  Wrapper.displayName = `withScrollEndEvent(${
    Component.displayName || 'Component'
  })`;

  return memo(
    forwardRef<ComponentRef<ComponentType<PropsT>>, ExtendProps<PropsT>>(
      Wrapper as any,
    ),
  );
};

export default withScrollEndEvent;
