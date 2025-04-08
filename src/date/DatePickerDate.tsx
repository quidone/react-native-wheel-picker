import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';
import {DateUtils} from './date';
import {useStableCallback} from '@rozhkov/react-useful-hooks';

export type DatePickerDateProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerDate = ({
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

  return (
    <Picker
      {...restProps}
      value={value.date}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerDate);
