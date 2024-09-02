import React, {useCallback, useMemo, useRef} from 'react';
import type {TextStyle} from 'react-native';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
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
  RenderScrollView,
} from '../types';
import Overlay from '../overlay/Overlay';
import {createFaces} from '../item/faces';
import PickerItemContainer from '../item/PickerItemContainer';
import {useBoolean} from '@utils/react';
import {useInit} from '@rozhkov/react-useful-hooks';
import List from '../list/List';
import {useSharedValue} from 'react-native-reanimated';
export type PickerProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  value?: ItemT['value'];
  itemHeight?: number;
  width?: number | string;

  onValueChanging?: OnValueChanging<ItemT>;
  onValueChanged?: OnValueChanged<ItemT>;

  keyExtractor?: KeyExtractor<ItemT>;
  renderItem?: RenderItem<ItemT>;
  renderItemContainer?: RenderItemContainer<ItemT>;
  renderOverlay?: RenderOverlay | null;
  renderList?: RenderList<ItemT>;
  renderScrollView?: RenderScrollView;
  style?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  overlayItemStyle?: StyleProp<ViewStyle>;

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
const defaultRenderItemContainer: RenderItemContainer<any> = (props) => (
  <PickerItemContainer {...props} />
);
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

  onValueChanged,
  onValueChanging,

  keyExtractor = defaultKeyExtractor,
  renderItem = defaultRenderItem,
  renderItemContainer = defaultRenderItemContainer,
  renderOverlay = defaultRenderOverlay,
  renderList = defaultRenderList,

  style,
  itemTextStyle,
  overlayItemStyle,
  ...restProps
}: PickerProps<ItemT>) => {
  const valueIndex = useValueIndex(data, value);
  const initialIndex = useInit(() => valueIndex);
  const offsetY = useSharedValue(initialIndex * itemHeight);
  const listRef = useRef<ListMethods>(null);
  const touching = useBoolean(false);

  const height = itemHeight * 5;
  const faces = useMemo(() => createFaces(itemHeight), [itemHeight]);
  const renderPickerItem = useCallback<RenderPickerItem<ItemT>>(
    ({item, index, key}) =>
      renderItemContainer({key, item, index, faces, renderItem, itemTextStyle}),
    [faces, itemTextStyle, renderItem, renderItemContainer],
  );

  useValueEventsEffect(
    {
      data,
      valueIndex,
      itemHeight,
      offsetYAv: offsetY,
      touching: touching.value,
    },
    {onValueChanging, onValueChanged},
  );
  useSyncScrollEffect({listRef, valueIndex, touching: touching.value});

  return (
    <ScrollContentOffsetContext.Provider value={offsetY}>
      <PickerItemHeightContext.Provider value={itemHeight}>
        <View style={[styles.root, style, {height, width}]}>
          {renderList({
            ...restProps,
            ref: listRef,
            data,
            initialIndex,
            itemHeight,
            keyExtractor,
            renderItem: renderPickerItem,
            scrollOffset: offsetY,
            onTouchStart: touching.setTrue,
            onTouchEnd: touching.setFalse,
            onTouchCancel: touching.setFalse,
          })}
          {renderOverlay !== null &&
            renderOverlay({
              itemHeight,
              pickerWidth: width,
              pickerHeight: height,
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
