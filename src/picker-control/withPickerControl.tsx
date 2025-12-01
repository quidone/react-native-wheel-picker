import type {Control} from './create-control';
import React, {
  type ComponentRef,
  type ComponentType,
  forwardRef,
  memo,
} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {usePickerControlSubscriber} from './usePickerControlSubscriber';
import {
  type OnValueChanged,
  type OnValueChanging,
  type PickerItem,
  useValueIndex,
} from '../base';
type RequiredPickerProps = {
  data: ReadonlyArray<PickerItem<unknown>>;
  value?: unknown;
  extraValues?: unknown[];
  onValueChanging?: OnValueChanging<PickerItem<unknown>>;
  onValueChanged?: OnValueChanged<PickerItem<unknown>>;
  _enableSyncScrollAfterScrollEnd?: boolean;
  _onScrollStart?: () => void;
  _onScrollEnd?: () => void;
};
export type WithPickerControlProps<PickerPropsT extends RequiredPickerProps> =
  PickerPropsT & {
    pickerName: string;
    control: Control;
  };
export const withPickerControl = <PropsT extends RequiredPickerProps>(
  PickerComponent: ComponentType<PropsT>,
) => {
  const WrappedPicker = (
    {
      pickerName,
      control,
      data,
      value,
      // extraValues TODO pass to props
      onValueChanging: onValueChangingProp,
      onValueChanged: onValueChangedProp,
      _onScrollStart: onScrollStartProp,
      _onScrollEnd: onScrollEndProp,
      ...restProps
    }: WithPickerControlProps<PropsT>,
    forwardedRef: any,
  ) => {
    const valueIndex = useValueIndex(data, value);
    const currentItem = data[valueIndex]!;
    const subscriber = usePickerControlSubscriber({
      control,
      pickerName,
      currentItem,
    });
    const onValueChangingStable = useStableCallback<
      OnValueChanging<PickerItem<unknown>>
    >((event) => {
      subscriber.emitOnValueChanging(event);
      onValueChangingProp?.(event);
    });
    const onValueChangedStable = useStableCallback<
      OnValueChanged<PickerItem<unknown>>
    >((event) => {
      subscriber.emitOnValueChanged(event);
      onValueChangedProp?.(event);
    });
    const onScrollStartStable = useStableCallback(() => {
      subscriber.onScrollStart();
      onScrollStartProp?.();
    });
    const onScrollEndStable = useStableCallback(() => {
      subscriber.onScrollEnd();
      onScrollEndProp?.();
    });
    return (
      <PickerComponent
        {...(restProps as any)}
        ref={forwardedRef}
        data={data}
        value={value}
        extraValues={subscriber.extraValues}
        onValueChanging={onValueChangingStable}
        onValueChanged={onValueChangedStable}
        _enableSyncScrollAfterScrollEnd={
          subscriber.enableSyncScrollAfterScrollEnd
        }
        _onScrollStart={onScrollStartStable}
        _onScrollEnd={onScrollEndStable}
      />
    );
  };
  WrappedPicker.displayName = `withPickerControl(${PickerComponent.displayName})`;
  return memo(
    forwardRef<
      ComponentRef<ComponentType<PropsT>>,
      WithPickerControlProps<PropsT>
    >(WrappedPicker as any),
  );
};
