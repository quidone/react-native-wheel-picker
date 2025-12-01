import React, {
  type ForwardedRef,
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
  type ViewStyle,
  type StyleProp,
  Animated,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useInit} from '@rozhkov/react-useful-hooks';
import {withScrollStartEndEvent} from '../../utils/scrolling';
const ExtendedAnimatedScrollView = withScrollStartEndEvent(Animated.ScrollView);
const OFFSET_X = 0;
const getOffsetY = (index: number, itemHeight: number) => index * itemHeight;
export type ListProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  pickerHeight: number;
  readOnly: boolean;
  initialIndex: number;
  scrollOffset: Animated.Value;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  onScrollStart: (() => void) | undefined;
  onScrollEnd: () => void;
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
    readOnly,
    scrollOffset,
    onTouchEnd,
    onTouchStart,
    onTouchCancel,
    onScrollStart,
    onScrollEnd,
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
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                y: scrollOffset,
              },
            },
          },
        ],
        {
          useNativeDriver: true,
        },
      ),
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
    <ExtendedAnimatedScrollView
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      scrollEnabled={!readOnly}
      {...restProps}
      ref={listRef}
      contentOffset={initialOffset}
      onScroll={onScroll}
      scrollOffset={scrollOffset}
      snapToOffsets={snapToOffsets}
      style={styles.list}
      contentContainerStyle={contentContainerStyle}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchCancel}
      nestedScrollEnabled={true}
      removeClippedSubviews={false}
      onScrollStart={onScrollStart}
      onScrollEnd={onScrollEnd}
    >
      {data.map((item, index) =>
        renderItem({
          key: keyExtractor(item, index),
          item,
          index,
        }),
      )}
    </ExtendedAnimatedScrollView>
  );
};
const styles = StyleSheet.create({
  list: {
    width: '100%',
    overflow: 'visible',
  },
});
export default memo(forwardRef(List));
