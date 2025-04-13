import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {DateUtils} from './date';

export type DatePickerMonthProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerMonth = ({
  width = 60,
  overlayItemStyle: overlayItemStyleProp,
  onValueChanged: onValueChangedProp,
  ...restProps
}: DatePickerMonthProps) => {
  const dateContext = useDateContext();
  const value = dateContext.value;
  const data = useMemo(() => {
    return [...Array(DateUtils.MONTH_COUNT).keys()].map((index) => ({
      value: index,
      label: index + 1,
    }));
  }, []);

  const onValueChanged = useStableCallback<
    DatePickerMonthProps['onValueChanged']
  >((event) => {
    dateContext.onDateUnitsChanged({...value, month: event.item.value});
    onValueChangedProp?.(event);
  });

  const overlayItemStyle = useOverlayItemStyle({
    curUnit: 'month',
    unitPositions: dateContext.unitPosition,
    propStyle: overlayItemStyleProp,
  });

  return (
    <Picker
      {...restProps}
      value={value.month}
      data={data}
      width={width}
      overlayItemStyle={overlayItemStyle}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerMonth);
