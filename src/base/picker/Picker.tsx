import React, {useCallback, useMemo, useRef, useState} from 'react';
import type {FlatList} from 'react-native';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import PickerItemComponent from '../item/PickerItem';
import {ScrollContentOffsetContext} from '../contexts/ScrollContentOffsetContext';
import {createCellRendererComponent} from '../item/CellRendererComponent';
import {PickerItemHeightContext} from '../contexts/PickerItemHeightContext';
import SelectionOverlay from '../overlay/SelectionOverlay';
import useValueEventsEffect from './hooks/useValueEventsEffect';
import useSyncScrollEffect from './hooks/useSyncScrollEffect';
import type {
  KeyExtractor,
  PickerItem,
  RenderItem,
  RenderOverlayContainer,
  RenderSelectionOverlay,
  ValueChangedEvent,
  ValueChangingEvent,
} from '../types';
import OverlayContainer from '../overlay/OverlayContainer';

export type PickerProps<ItemT extends PickerItem<any>> = {
  data: ReadonlyArray<ItemT>;
  value?: ItemT['value'];
  onValueChanging?: (event: ValueChangingEvent<ItemT>) => void;
  onValueChanged?: (event: ValueChangedEvent<ItemT>) => void;
  itemHeight?: number;
  width?: number | string;
  keyExtractor?: KeyExtractor<ItemT>;
  renderItem?: RenderItem<ItemT>;
  renderSelectionOverlay?: RenderSelectionOverlay | null;
  renderOverlayContainer?: RenderOverlayContainer | null;
  style?: StyleProp<ViewStyle>;
  disableVirtualization?: boolean;
  initialNumToRender?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  scrollEventThrottle?: number;
};

const defaultKeyExtractor: KeyExtractor<any> = (_, index) => index.toString();
const defaultRenderItem: RenderItem<PickerItem<any>> = ({
  item: {value, label},
}) => <PickerItemComponent value={value} label={label} />;
const defaultRenderSelectionOverlay: RenderSelectionOverlay = ({
  itemHeight,
  pickerWidth,
}) => <SelectionOverlay height={itemHeight} width={pickerWidth} />;
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
  keyExtractor = defaultKeyExtractor,
  renderItem = defaultRenderItem,
  renderSelectionOverlay = defaultRenderSelectionOverlay,
  renderOverlayContainer = defaultRenderOverlayContainer,
  onValueChanged,
  onValueChanging,
  style,
  initialNumToRender = 3,
  maxToRenderPerBatch = 3,
  updateCellsBatchingPeriod = 10,
  disableVirtualization,
  windowSize,
  scrollEventThrottle = 16,
}: PickerProps<ItemT>) => {
  const valueIndex = useValueIndex(data, value);
  const offsetYAv = useRef(new Animated.Value(valueIndex * itemHeight)).current;
  const listRef = useRef<FlatList>(null);

  const [touching, setTouching] = useState(false);

  useValueEventsEffect(
    {data, valueIndex, itemHeight, offsetYAv, touching},
    {onValueChanging, onValueChanged},
  );
  useSyncScrollEffect({listRef, valueIndex, touching});

  const height = itemHeight * 5;
  const snapToOffsets = useMemo(
    () => data.map((_, i) => i * itemHeight),
    [data, itemHeight],
  );
  const CellRendererComponent = useMemo(
    () => createCellRendererComponent(itemHeight),
    [itemHeight],
  );
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  return (
    <ScrollContentOffsetContext.Provider value={offsetYAv}>
      <PickerItemHeightContext.Provider value={itemHeight}>
        <View style={[{height, width}, style]}>
          {renderOverlayContainer !== null &&
            renderOverlayContainer({
              itemHeight,
              renderSelectionOverlay,
              pickerWidth: width,
              pickerHeight: height,
            })}
          <Animated.FlatList
            ref={listRef}
            data={data as Animated.WithAnimatedObject<typeof data>}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: offsetYAv}}}],
              {useNativeDriver: true},
            )}
            contentContainerStyle={{paddingVertical: itemHeight * 2}}
            scrollEventThrottle={scrollEventThrottle}
            initialScrollIndex={valueIndex}
            snapToOffsets={snapToOffsets}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            CellRendererComponent={CellRendererComponent}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={maxToRenderPerBatch}
            updateCellsBatchingPeriod={updateCellsBatchingPeriod}
            disableVirtualization={disableVirtualization}
            windowSize={windowSize}
            onTouchStart={() => {
              setTouching(true);
            }}
            onTouchEnd={() => {
              setTouching(false);
            }}
            onTouchCancel={() => {
              setTouching(false);
            }}
          />
        </View>
      </PickerItemHeightContext.Provider>
    </ScrollContentOffsetContext.Provider>
  );
};

export default Picker;
