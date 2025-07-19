import React, {
  type ComponentType,
  createContext,
  type ForwardedRef,
  forwardRef,
  memo,
  type PropsWithChildren,
  useContext,
} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useMemoObject} from '@rozhkov/react-useful-hooks';
import type {PickerProps} from '@implementation/base';

type ContextValue = {
  itemHeight: number | undefined;
  visibleItemCount: number | undefined;
  readOnly: boolean | undefined;
  enableScrollByTapOnItem: boolean | undefined;
  scrollEventThrottle: number | undefined;
  pickerStyle: StyleProp<ViewStyle> | undefined;
  itemTextStyle: StyleProp<TextStyle> | undefined;
  overlayItemStyle: StyleProp<ViewStyle> | undefined;
  contentContainerStyle: StyleProp<ViewStyle> | undefined;
};

const DatePickerCommonPropsContext = createContext<ContextValue | undefined>(
  undefined,
);

type DatePickerCommonPropsProviderProps = PropsWithChildren<ContextValue>;

const DatePickerCommonPropsProvider = ({
  children,
  ...restProps
}: DatePickerCommonPropsProviderProps) => {
  const memoizedValue = useMemoObject(restProps);

  return (
    <DatePickerCommonPropsContext.Provider value={memoizedValue}>
      {children}
    </DatePickerCommonPropsContext.Provider>
  );
};

export default DatePickerCommonPropsProvider;

const useDatePickerCommonProps = () => {
  const value = useContext(DatePickerCommonPropsContext);
  if (value === undefined) {
    throw new Error(
      'useDatePickerCommonProps must be called from within DatePickerCommonPropsContext.Provider!',
    );
  }
  return useContext(DatePickerCommonPropsContext)!;
};

type PickedWheelPickerProps = Pick<
  PickerProps<any>,
  Exclude<keyof ContextValue, 'pickerStyle'> | 'style'
>;

export const withCommonProps = <ComponentPropsT extends PickedWheelPickerProps>(
  WheelPickerComponent: ComponentType<ComponentPropsT>,
) => {
  const WrappedWheelPicker = (
    {
      style: pickerStyleProp,
      contentContainerStyle: contentContainerStyleProp,
      itemTextStyle: itemTextStyleProp,
      overlayItemStyle: overlayItemStyleProp,
      ...restProps
    }: PickedWheelPickerProps,
    forwardedRef: ForwardedRef<any>,
  ) => {
    const {
      pickerStyle: pickerStyleCommon,
      contentContainerStyle: contentContainerStyleCommon,
      itemTextStyle: itemTextStyleCommon,
      overlayItemStyle: overlayItemStyleCommon,
      ...restCommonProps
    } = useDatePickerCommonProps();

    return (
      <WheelPickerComponent
        {...(restCommonProps as ComponentPropsT)}
        {...(restProps as ComponentPropsT)}
        style={[pickerStyleCommon, pickerStyleProp]}
        contentContainerStyle={[
          contentContainerStyleCommon,
          contentContainerStyleProp,
        ]}
        itemTextStyle={[itemTextStyleCommon, itemTextStyleProp]}
        overlayItemStyle={[overlayItemStyleCommon, overlayItemStyleProp]}
        ref={forwardedRef}
      />
    );
  };

  WrappedWheelPicker.displayName = `withDateCommonProps(${WheelPickerComponent.displayName})`;

  return memo(forwardRef(WrappedWheelPicker)) as typeof WheelPickerComponent;
};
