import type React from 'react';
import type {Faces} from './item/faces';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {SharedValue} from 'react-native-reanimated';
import type {AnimatedScrollView} from 'react-native-reanimated/lib/typescript/component/ScrollView';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
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
  key?: string;
  item: ItemT;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<ItemT>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
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
  ref: React.RefObject<ListMethods>;
  data: ReadonlyArray<ItemT>;
  keyExtractor: KeyExtractor<ItemT>;
  renderItem: RenderPickerItem<ItemT>;
  itemHeight: number;
  initialIndex: number;
  scrollOffset: SharedValue<number>;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
} & Record<string, any>;
export type RenderList<ItemT extends PickerItem<any>> = (
  props: RenderListProps<ItemT>,
) => React.ReactElement;
export type RenderScrollView =
  | AnimatedScrollView
  | typeof BottomSheetScrollView;
export type RenderOverlayProps = {
  itemHeight: number;
  pickerWidth: number | string;
  pickerHeight: number;
  overlayItemStyle: StyleProp<ViewStyle> | undefined;
};
export type RenderOverlay = (
  props: RenderOverlayProps,
) => React.ReactElement | null;

// events
export type ValueChangingEvent<ItemT> = {item: ItemT; index: number};
export type ValueChangedEvent<ItemT> = {item: ItemT; index: number};
export type OnValueChanging<ItemT> = (event: ValueChangingEvent<ItemT>) => void;
export type OnValueChanged<ItemT> = (event: ValueChangedEvent<ItemT>) => void;
