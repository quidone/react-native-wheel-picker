import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type {
  KeyExtractor,
  ListMethods,
  PickerItem,
  RenderPickerItem,
  RenderScrollView,
} from '../types';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {SharedValue, runOnJS} from 'react-native-reanimated';
import {useInit, useMemoObject} from '@rozhkov/react-useful-hooks';
import {AnimatedScrollView} from 'react-native-reanimated/lib/typescript/component/ScrollView';

const OFFSET_X = 0;
const getOffsetY = (index: number, itemHeight: number) => index * itemHeight;

export type ListProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  initialIndex: number;
  scrollOffset: SharedValue<number>;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  renderScrollView?: RenderScrollView;
};

const List = <ItemT extends PickerItem<any>>(
  {
    initialIndex,
    data,
    keyExtractor,
    renderItem,
    itemHeight,
    scrollOffset,
    onTouchEnd,
    onTouchStart,
    onTouchCancel,
    renderScrollView,
    ...restProps
  }: ListProps<ItemT>,
  forwardedRef: ForwardedRef<ListMethods>,
) => {
  const listRef = useRef<AnimatedScrollView>(null);
  useImperativeHandle(
    forwardedRef,
    () => ({
      scrollToIndex: ({index, animated}) => {
        listRef.current?.scrollTo({
          x: OFFSET_X,
          y: getOffsetY(index, itemHeight),
          animated,
        });
      },
    }),
    [itemHeight],
  );
  const initialOffset = useInit(() => ({
    x: OFFSET_X,
    y: getOffsetY(initialIndex, itemHeight),
  }));

  const snapToOffsets = useMemo(
    () => data.map((_, i) => i * itemHeight),
    [data, itemHeight],
  );
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const wrapper = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffset.value = _e.nativeEvent.contentOffset.y;
    };
    renderScrollView ? runOnJS(wrapper)(e) : wrapper(e);
  };
  const contentContainerStyle = useMemoObject<ViewStyle>({
    paddingVertical: itemHeight * 2,
  });
  const ScrollView = useMemo(
    () => renderScrollView ?? Animated.ScrollView,
    [renderScrollView],
  );
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      {...restProps}
      ref={listRef}
      contentOffset={initialOffset}
      onScroll={onScroll}
      snapToOffsets={snapToOffsets}
      style={styles.list}
      contentContainerStyle={contentContainerStyle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      nestedScrollEnabled={true}
    >
      {data.map((item, index) =>
        renderItem({key: keyExtractor(item, index), item, index}),
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {width: '100%', overflow: 'visible'},
});

export default memo(forwardRef(List));
