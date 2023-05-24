import type React from 'react';
import type {Faces} from './item/faces';
import type {Animated, StyleProp, TextStyle, ViewStyle} from 'react-native';

export type ListMethods = {
  scrollToIndex: (params: {index: number; animated: boolean}) => void;
};

export type PickerItem<T> = {
  value: T;
  label?: string;
};

export type KeyExtractor<ItemT extends PickerItem<any>> = (
  item: ItemT,
  index: number,
) => string;
export type RenderItem<ItemT extends PickerItem<any>> = (info: {
  item: ItemT;
  index: number;
  itemTextStyle: StyleProp<TextStyle> | undefined;
}) => React.ReactElement | null;
export type RenderItemContainer<ItemT extends PickerItem<any>> = (info: {
  key?: string;
  item: ItemT;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<ItemT>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
}) => React.ReactElement;
export type RenderPickerItem<ItemT extends PickerItem<any>> = (info: {
  key?: string;
  item: ItemT;
  index: number;
}) => React.ReactElement;

export type RenderList<ItemT extends PickerItem<any>> = (
  info: {
    ref: React.RefObject<ListMethods>;
    data: ReadonlyArray<ItemT>;
    keyExtractor: KeyExtractor<ItemT>;
    renderItem: RenderPickerItem<ItemT>;
    itemHeight: number;
    initialIndex: number;
    scrollOffset: Animated.Value;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  } & Record<string, any>,
) => React.ReactElement;

export type RenderSelectionOverlay = (info: {
  itemHeight: number;
  pickerWidth: number | string;
  selectionOverlayStyle: StyleProp<ViewStyle> | undefined;
}) => React.ReactElement | null;
export type RenderOverlayContainer = (info: {
  itemHeight: number;
  pickerWidth: number | string;
  pickerHeight: number;
  renderSelectionOverlay: RenderSelectionOverlay | null | undefined;
  selectionOverlayStyle: StyleProp<ViewStyle> | undefined;
}) => React.ReactElement | null;

export type ValueChangingEvent<ItemT> = {item: ItemT; index: number};
export type ValueChangedEvent<ItemT> = {item: ItemT; index: number};
