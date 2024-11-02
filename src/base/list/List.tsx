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
} from '../types';
import {
  Animated,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useInit} from '@rozhkov/react-useful-hooks';

const OFFSET_X = 0;
const getOffsetY = (index: number, itemHeight: number) => index * itemHeight;

export type ListProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  pickerHeight: number;
  initialIndex: number;
  scrollOffset: Animated.Value;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  contentContainerStyle: StyleProp<ViewStyle> | undefined;
};

const List = <ItemT extends PickerItem<any>>(
  {
    initialIndex,
    data,
    keyExtractor,
    renderItem,
    itemHeight,
    pickerHeight,
    scrollOffset,
    onTouchEnd,
    onTouchStart,
    onTouchCancel,
    contentContainerStyle: contentContainerStyleProp,
    ...restProps
  }: ListProps<ItemT>,
  forwardedRef: ForwardedRef<ListMethods>,
) => {
  const listRef = useRef<ScrollView>(null);
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
  const onScroll = useMemo(
    () =>
      Animated.event([{nativeEvent: {contentOffset: {y: scrollOffset}}}], {
        useNativeDriver: true,
      }),
    [scrollOffset],
  );

  const contentContainerStyle = useMemo(() => {
    return [
      {
        paddingVertical: (pickerHeight - itemHeight) / 2,
      },
      contentContainerStyleProp,
    ];
  }, [pickerHeight, itemHeight, contentContainerStyleProp]);

  return (
    <Animated.ScrollView
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
      removeClippedSubviews={false}
    >
      {data.map((item, index) =>
        renderItem({key: keyExtractor(item, index), item, index}),
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {width: '100%', overflow: 'visible'},
});

export default memo(forwardRef(List));
