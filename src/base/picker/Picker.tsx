import React, {useCallback, useMemo, useRef} from 'react';
import type {TextStyle} from 'react-native';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import PickerItemComponent from '../item/PickerItem';
import {ScrollContentOffsetContext} from '../contexts/ScrollContentOffsetContext';
import {PickerItemHeightContext} from '../contexts/PickerItemHeightContext';
import SelectionOverlay from '../overlay/SelectionOverlay';
import useValueEventsEffect from './hooks/useValueEventsEffect';
import useSyncScrollEffect from './hooks/useSyncScrollEffect';
import type {
  KeyExtractor,
  ListMethods,
  PickerItem,
  RenderItem,
  RenderItemContainer,
  RenderList,
  RenderOverlayContainer,
  RenderPickerItem,
  RenderSelectionOverlay,
  ValueChangedEvent,
  ValueChangingEvent,
} from '../types';
import OverlayContainer from '../overlay/OverlayContainer';
import {createFaces} from '../item/faces';
import PickerItemContainer from '../item/PickerItemContainer';
import {useBoolean} from '@utils/react';
import {useInit} from '@rozhkov/react-useful-hooks';
import List from '../list/List';

export type PickerProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  value?: ItemT['value'];
  itemHeight?: number;
  width?: number | string;

  onValueChanging?: (event: ValueChangingEvent<ItemT>) => void;
  onValueChanged?: (event: ValueChangedEvent<ItemT>) => void;

  keyExtractor?: KeyExtractor<ItemT>;
  renderItem?: RenderItem<ItemT>;
  renderItemContainer?: RenderItemContainer<ItemT>;
  renderSelectionOverlay?: RenderSelectionOverlay | null;
  renderOverlayContainer?: RenderOverlayContainer | null;
  renderList?: RenderList<ItemT>;

  style?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectionOverlayStyle?: StyleProp<ViewStyle>;

  scrollEventThrottle?: number;
  disableVirtualization?: boolean;
  initialNumToRender?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
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
const defaultRenderSelectionOverlay: RenderSelectionOverlay = ({
  itemHeight,
  selectionOverlayStyle,
}) => (
  <SelectionOverlay
    height={itemHeight}
    selectionOverlayStyle={selectionOverlayStyle}
  />
);
const defaultRenderOverlayContainer: RenderOverlayContainer = (props) => (
  <OverlayContainer {...props} />
);
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
  renderSelectionOverlay = defaultRenderSelectionOverlay,
  renderOverlayContainer = defaultRenderOverlayContainer,
  renderList = defaultRenderList,

  style,
  itemTextStyle,
  selectionOverlayStyle,

  ...restProps
}: PickerProps<ItemT>) => {
  const valueIndex = useValueIndex(data, value);
  const initialIndex = useInit(() => valueIndex);
  const offsetY = useRef(new Animated.Value(valueIndex * itemHeight)).current;
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
          {renderOverlayContainer !== null &&
            renderOverlayContainer({
              itemHeight,
              renderSelectionOverlay,
              pickerWidth: width,
              pickerHeight: height,
              selectionOverlayStyle,
            })}
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
        </View>
      </PickerItemHeightContext.Provider>
    </ScrollContentOffsetContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {justifyContent: 'center', alignItems: 'center'},
});

export default Picker;
