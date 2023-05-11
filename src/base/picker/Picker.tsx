import React, {memo, useCallback, useMemo, useRef} from 'react';
import type {FlatList, ListRenderItemInfo, TextStyle} from 'react-native';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import PickerItemComponent from '../item/PickerItem';
import {ScrollContentOffsetContext} from '../contexts/ScrollContentOffsetContext';
import {PickerItemHeightContext} from '../contexts/PickerItemHeightContext';
import SelectionOverlay from '../overlay/SelectionOverlay';
import useValueEventsEffect from './hooks/useValueEventsEffect';
import useSyncScrollEffect from './hooks/useSyncScrollEffect';
import type {
  KeyExtractor,
  PickerItem,
  RenderItem,
  RenderItemContainer,
  RenderOverlayContainer,
  RenderSelectionOverlay,
  ValueChangedEvent,
  ValueChangingEvent,
} from '../types';
import OverlayContainer from '../overlay/OverlayContainer';
import {createFaces} from '../item/faces';
import PickerItemContainer from '../item/PickerItemContainer';
import {useBoolean} from '@utils/react';
import {useInit, useMemoObject} from '@rozhkov/react-useful-hooks';

const MemoAnimatedFlatList = memo(
  Animated.FlatList,
) as unknown as typeof Animated.FlatList;

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
  pickerWidth,
  selectionOverlayStyle,
}) => (
  <SelectionOverlay
    height={itemHeight}
    width={pickerWidth}
    selectionOverlayStyle={selectionOverlayStyle}
  />
);
const defaultRenderOverlayContainer: RenderOverlayContainer = (props) => (
  <OverlayContainer {...props} />
);

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

  style,
  itemTextStyle,
  selectionOverlayStyle,

  scrollEventThrottle = 16,
  initialNumToRender = 3,
  maxToRenderPerBatch = 3,
  updateCellsBatchingPeriod = 10,
  disableVirtualization = true,
  windowSize,
}: PickerProps<ItemT>) => {
  const valueIndex = useValueIndex(data, value);
  const initialScrollIndex = useInit(() => valueIndex);
  const offsetYAv = useRef(new Animated.Value(valueIndex * itemHeight)).current;
  const listRef = useRef<FlatList>(null);
  const touching = useBoolean(false);

  const height = itemHeight * 5;
  const paddingVertical = itemHeight * 2;
  const faces = useMemo(() => createFaces(itemHeight), [itemHeight]);
  const renderPickerItem = useCallback(
    ({item, index}: ListRenderItemInfo<ItemT>) =>
      renderItemContainer({item, index, faces, renderItem, itemTextStyle}),
    [faces, itemTextStyle, renderItem, renderItemContainer],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );
  const snapToOffsets = useMemo(
    () => data.map((_, i) => i * itemHeight),
    [data, itemHeight],
  );
  const onScroll = useMemo(
    () =>
      Animated.event([{nativeEvent: {contentOffset: {y: offsetYAv}}}], {
        useNativeDriver: true,
      }),
    [offsetYAv],
  );
  const contentContainerStyle = useMemoObject({paddingVertical});

  useValueEventsEffect(
    {data, valueIndex, itemHeight, offsetYAv, touching: touching.value},
    {onValueChanging, onValueChanged},
  );
  useSyncScrollEffect({listRef, valueIndex, touching: touching.value});

  return (
    <ScrollContentOffsetContext.Provider value={offsetYAv}>
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
          <MemoAnimatedFlatList
            ref={listRef}
            data={data as Animated.WithAnimatedObject<typeof data>}
            renderItem={renderPickerItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            onScroll={onScroll}
            style={styles.list}
            contentContainerStyle={contentContainerStyle}
            scrollEventThrottle={scrollEventThrottle}
            initialScrollIndex={initialScrollIndex}
            snapToOffsets={snapToOffsets}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={maxToRenderPerBatch}
            updateCellsBatchingPeriod={updateCellsBatchingPeriod}
            disableVirtualization={disableVirtualization}
            windowSize={windowSize}
            onTouchStart={touching.setTrue}
            onTouchEnd={touching.setFalse}
            onTouchCancel={touching.setFalse}
          />
        </View>
      </PickerItemHeightContext.Provider>
    </ScrollContentOffsetContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {justifyContent: 'center', alignItems: 'center'},
  list: {width: '100%'},
});

export default Picker;
