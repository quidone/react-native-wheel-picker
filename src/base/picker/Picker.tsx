import React, {useCallback, useMemo, useRef} from 'react';
import type {TextStyle} from 'react-native';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import PickerItemComponent from '../item/PickerItem';
import {ScrollContentOffsetContext} from '../contexts/ScrollContentOffsetContext';
import {PickerItemHeightContext} from '../contexts/PickerItemHeightContext';
import useValueEventsEffect from './hooks/useValueEventsEffect';
import useSyncScrollEffect from './hooks/useSyncScrollEffect';
import type {
  KeyExtractor,
  ListMethods,
  OnValueChanged,
  OnValueChanging,
  PickerItem,
  RenderItem,
  RenderItemContainer,
  RenderList,
  RenderOverlay,
  RenderPickerItem,
} from '../types';
import Overlay from '../overlay/Overlay';
import {calcPickerHeight, createFaces} from '../item/faces';
import PickerItemContainer from '../item/PickerItemContainer';
import {useBoolean} from '@utils/react';
import {useInit} from '@rozhkov/react-useful-hooks';
import List from '../list/List';

export type PickerProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  value?: ItemT['value'];
  itemHeight?: number;
  visibleItemCount?: number;
  width?: number | 'auto' | `${number}%`;
  readOnly?: boolean;
  testID?: string;

  onValueChanging?: OnValueChanging<ItemT>;
  onValueChanged?: OnValueChanged<ItemT>;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  onTouchCancel?: () => void;
  onScrollEnd?: () => void;

  keyExtractor?: KeyExtractor<ItemT>;
  renderItem?: RenderItem<ItemT>;
  renderItemContainer?: RenderItemContainer<ItemT>;
  renderOverlay?: RenderOverlay | null;
  renderList?: RenderList<ItemT>;

  style?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  overlayItemStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;

  scrollEventThrottle?: number;
};

const defaultKeyExtractor: KeyExtractor<any> = (_, index) => index.toString();
const defaultRenderItem: RenderItem<PickerItem<any>> = ({
  item: {value, label},
  itemTextStyle,
}) => (
  <PickerItemComponent
    value={value}
    label={label}
    itemTextStyle={itemTextStyle}
  />
);
const defaultRenderItemContainer: RenderItemContainer<any> = ({
  key,
  ...props
}) => <PickerItemContainer key={key} {...props} />;
const defaultRenderOverlay: RenderOverlay = (props) => <Overlay {...props} />;
const defaultRenderList: RenderList<any> = (props) => {
  return <List {...props} />;
};

const useValueIndex = (data: ReadonlyArray<PickerItem<any>>, value: any) => {
  return useMemo(() => {
    const index = data.findIndex((x) => x.value === value);
    return index >= 0 ? index : 0;
  }, [data, value]);
};

const Picker = <ItemT extends PickerItem<any>>({
  data,
  value,
  width = 'auto',
  itemHeight = 48,
  visibleItemCount = 5,
  readOnly = false,
  testID,

  onValueChanged,
  onValueChanging,

  onTouchStart,
  onTouchEnd,
  onTouchCancel,
  onScrollEnd: onListScrollEnd,

  keyExtractor = defaultKeyExtractor,
  renderItem = defaultRenderItem,
  renderItemContainer = defaultRenderItemContainer,
  renderOverlay = defaultRenderOverlay,
  renderList = defaultRenderList,

  style,
  itemTextStyle,
  overlayItemStyle,
  contentContainerStyle,
  ...restProps
}: PickerProps<ItemT>) => {
  const valueIndex = useValueIndex(data, value);
  const initialIndex = useInit(() => valueIndex);
  const offsetY = useRef(new Animated.Value(valueIndex * itemHeight)).current;
  const listRef = useRef<ListMethods>(null);
  const touching = useBoolean(false);

  const [faces, pickerHeight] = useMemo(() => {
    const items = createFaces(itemHeight, visibleItemCount);
    const height = calcPickerHeight(items, itemHeight);
    return [items, height];
  }, [itemHeight, visibleItemCount]);
  const renderPickerItem = useCallback<RenderPickerItem<ItemT>>(
    ({item, index, key}) =>
      renderItemContainer({key, item, index, faces, renderItem, itemTextStyle}),
    [faces, itemTextStyle, renderItem, renderItemContainer],
  );

  const {activeIndexRef, onScrollEnd} = useValueEventsEffect(
    {
      data,
      valueIndex,
      itemHeight,
      offsetYAv: offsetY,
    },
    {onValueChanging, onValueChanged},
  );
  useSyncScrollEffect({
    listRef,
    valueIndex,
    activeIndexRef,
    touching: touching.value,
  });

  const onTouchStartProp = useStableCallback(() => {
    touching.setTrue();
    onTouchStart?.();
  });

  const onTouchEndProp = useStableCallback(() => {
    touching.setFalse();
    onTouchEnd?.();
  });

  const onTouchCancelProp = useStableCallback(() => {
    touching.setFalse();
    onTouchCancel?.();
  });

  const onScrollEndProp = useStableCallback(() => {
    onScrollEnd();
    onListScrollEnd?.();
  });

  return (
    <ScrollContentOffsetContext.Provider value={offsetY}>
      <PickerItemHeightContext.Provider value={itemHeight}>
        <View
          testID={testID}
          style={[styles.root, style, {height: pickerHeight, width}]}
        >
          {renderList({
            ...restProps,
            ref: listRef,
            data,
            initialIndex,
            itemHeight,
            pickerHeight,
            visibleItemCount,
            readOnly,
            keyExtractor,
            renderItem: renderPickerItem,
            scrollOffset: offsetY,
            onTouchStart: onTouchStartProp,
            onTouchEnd: onTouchEndProp,
            onTouchCancel: onTouchCancelProp,
            onScrollEnd: onScrollEndProp,
            contentContainerStyle,
          })}
          {renderOverlay &&
            renderOverlay({
              itemHeight,
              pickerWidth: width,
              pickerHeight,
              overlayItemStyle,
            })}
        </View>
      </PickerItemHeightContext.Provider>
    </ScrollContentOffsetContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {justifyContent: 'center', alignItems: 'center'},
});

export default Picker;
