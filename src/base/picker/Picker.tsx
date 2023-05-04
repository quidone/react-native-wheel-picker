import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import PickerItem from '../item/PickerItem';
import {ScrollContentOffsetContext} from '../contexts/ScrollContentOffsetContext';
import {createCellRendererComponent} from '../item/CellRendererComponent';
import {PickerItemHeightContext} from '../contexts/PickerItemHeightContext';
import SelectionOverlay from '../overlay/SelectionOverlay';
import useValueEventsEffect from './hooks/useValueEventsEffect';
import type {FlatList} from 'react-native';
import useSyncScrollEffect from './hooks/useSyncScrollEffect';

export type PickerItem<T> = {
  value: T;
  label?: string;
};

export type KeyExtractor<ItemT extends PickerItem<any>> = (
  item: ItemT,
  index: number,
) => string;
export type RenderItem<ItemT> = (info: {
  item: ItemT;
  index: number;
}) => React.ReactElement | null;
export type RenderSelectionOverlay = (info: {
  itemHeight: number;
  pickerWidth: number | string;
}) => React.ReactElement | null;

export type ValueChangingEvent<ItemT> = {item: ItemT; index: number};
export type ValueChangedEvent<ItemT> = {item: ItemT; index: number};

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
}) => <PickerItem value={value} label={label} />;
const defaultRenderSelectionOverlay: RenderSelectionOverlay = ({
  itemHeight,
  pickerWidth,
}) => <SelectionOverlay height={itemHeight} width={pickerWidth} />;

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
  onValueChanging,
  onValueChanged,
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
        <View style={[{height: itemHeight * 5, width}, style]}>
          {renderSelectionOverlay !== null && (
            <View style={styles.overlayContainer} pointerEvents={'none'}>
              {renderSelectionOverlay({pickerWidth: width, itemHeight})}
            </View>
          )}
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

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});

export default Picker;
