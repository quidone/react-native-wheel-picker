import React, {
  ForwardedRef,
  forwardRef,
  memo,
  RefObject,
  useCallback,
  useMemo,
} from 'react';
import {FlatList as RNFlatList, FlatListProps, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  SharedValue,
} from 'react-native-reanimated';
import type {
  KeyExtractor,
  ListMethods,
  PickerItem,
  RenderPickerItem,
} from '../../base/types';
import {useMemoObject} from '@rozhkov/react-useful-hooks';

export type AdditionalProps = Pick<
  FlatListProps<any>,
  | 'initialNumToRender'
  | 'maxToRenderPerBatch'
  | 'windowSize'
  | 'updateCellsBatchingPeriod'
>;

type VirtualizedListProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  initialIndex: number;
  scrollOffset: SharedValue<number>;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
} & AdditionalProps;

const VirtualizedList = <ItemT extends PickerItem<any>>(
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

    initialNumToRender = 3,
    maxToRenderPerBatch = 3,
    updateCellsBatchingPeriod = 10,
    windowSize,

    ...restProps
  }: VirtualizedListProps<ItemT>,
  forwardedRef: ForwardedRef<ListMethods>,
) => {
  const snapToOffsets = useMemo(
    () => data.map((_, i) => i * itemHeight),
    [data, itemHeight],
  );
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );
  const contentContainerStyle = useMemoObject({
    paddingVertical: itemHeight * 2,
  });

  return (
    <Animated.FlatList
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      {...restProps}
      ref={forwardedRef as RefObject<RNFlatList>}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialScrollIndex={initialIndex}
      onScroll={onScroll}
      snapToOffsets={snapToOffsets}
      style={styles.list}
      contentContainerStyle={contentContainerStyle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
      windowSize={windowSize}
      nestedScrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  list: {width: '100%', overflow: 'visible'},
});

export default memo(forwardRef(VirtualizedList));
