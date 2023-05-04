import type React from 'react';

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

export type RenderOverlayContainer = (info: {
  itemHeight: number;
  pickerWidth: number | string;
  pickerHeight: number;
  renderSelectionOverlay: RenderSelectionOverlay | null | undefined;
}) => React.ReactElement | null;

export type ValueChangingEvent<ItemT> = {item: ItemT; index: number};
export type ValueChangedEvent<ItemT> = {item: ItemT; index: number};
export type RenderSelectionOverlay = (info: {
  itemHeight: number;
  pickerWidth: number | string;
}) => React.ReactElement | null;
