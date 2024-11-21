import React, {
  type ComponentRef,
  type ComponentType,
  type ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useMemo,
} from 'react';
import type {
  ScrollViewProps,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
      ...rest
    }: ExtendProps<PropsT>,
    forwardedRef: ForwardedRef<ComponentRef<ComponentType<PropsT>>>,
  ) => {
    const onScrollEnd = useMemo(
      () => debounce(onScrollEndProp, 0), // This works well with onScrollEndDrag -> onMomentumScrollBegin transitions
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

  return memo(forwardRef(Wrapper));
};

export default withScrollEndEvent;
