import type React from 'react';
import type {Faces} from './item/faces';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';

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
  item: ItemT;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<ItemT>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
}) => React.ReactElement | null;

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
