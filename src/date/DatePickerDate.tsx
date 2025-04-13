import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {DateUtils} from './date';

export type DatePickerDateProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerDate = ({
  width = 60,
  overlayItemStyle: overlayItemStyleProp,
  onValueChanged: onValueChangedProp,
  ...restProps
}: DatePickerDateProps) => {
  const dateContext = useDateContext();
  const value = dateContext.value;
  const daysInMount = DateUtils.getDaysInMonth(value.year, value.month);
  const data = useMemo(() => {
    return [...Array(daysInMount).keys()].map((index) => ({
      value: index + 1,
    }));
  }, [daysInMount]);

  const onValueChanged = useStableCallback<
    DatePickerDateProps['onValueChanged']
  >((event) => {
    dateContext.onDateUnitsChanged({...value, date: event.item.value});
    onValueChangedProp?.(event);
  });

  const overlayItemStyle = useOverlayItemStyle({
    curUnit: 'date',
    unitPositions: dateContext.unitPosition,
    propStyle: overlayItemStyleProp,
  });

  return (
    <Picker
      {...restProps}
      value={value.date}
      data={data}
      width={width}
      overlayItemStyle={overlayItemStyle}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerDate);
