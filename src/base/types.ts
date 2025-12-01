import type React from 'react';
import type {RefObject} from 'react';
import type {Faces} from './item/faces';
import type {Animated, StyleProp, TextStyle, ViewStyle} from 'react-native';
export type ListMethods = {
  scrollToIndex: (params: {index: number; animated: boolean}) => void;
};
export type PickerItem<T> = {
  value: T;
  label?: string;
} & Record<string, any>;
export type KeyExtractor<ItemT extends PickerItem<any>> = (
  item: ItemT,
  index: number,
) => string;

// renders
export type RenderItemProps<ItemT extends PickerItem<any>> = {
  item: ItemT;
  index: number;
  itemTextStyle: StyleProp<TextStyle> | undefined;
};
export type RenderItem<ItemT extends PickerItem<any>> = (
  props: RenderItemProps<ItemT>,
) => React.ReactElement | null;
export type RenderItemContainerProps<ItemT extends PickerItem<any>> = {
  listRef: RefObject<ListMethods | null>;
  key?: string;
  item: ItemT;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<ItemT>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
  enableScrollByTapOnItem: boolean | undefined;
  readOnly: boolean | undefined;
};
export type RenderItemContainer<ItemT extends PickerItem<any>> = (
  props: RenderItemContainerProps<ItemT>,
) => React.ReactElement;
export type RenderPickerItem<ItemT extends PickerItem<any>> = (info: {
  key?: string;
  item: ItemT;
  index: number;
}) => React.ReactElement;
export type RenderListProps<ItemT extends PickerItem<any>> = {
  ref: React.RefObject<ListMethods | null>;
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  pickerHeight: number;
  visibleItemCount: number;
  readOnly: boolean;
  initialIndex: number;
  scrollOffset: Animated.Value;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  onScrollStart: (() => void) | undefined;
  onScrollEnd: () => void;
  contentContainerStyle: StyleProp<ViewStyle> | undefined;
} & Record<string, any>;
export type RenderList<ItemT extends PickerItem<any>> = (
  props: RenderListProps<ItemT>,
) => React.ReactElement;
export type RenderOverlayProps = {
  itemHeight: number;
  pickerWidth: number | 'auto' | `${number}%`;
  pickerHeight: number;
  overlayItemStyle: StyleProp<ViewStyle> | undefined;
};
export type RenderOverlay = (
  props: RenderOverlayProps,
) => React.ReactElement | null;

// events
export type ValueChangingEvent<ItemT extends PickerItem<any>> = {
  item: ItemT;
  index: number;
};
export type ValueChangedEvent<ItemT extends PickerItem<any>> = {
  item: ItemT;
  index: number;
};
export type OnValueChanging<ItemT extends PickerItem<any>> = (
  event: ValueChangingEvent<ItemT>,
) => void;
export type OnValueChanged<ItemT extends PickerItem<any>> = (
  event: ValueChangedEvent<ItemT>,
) => void;
