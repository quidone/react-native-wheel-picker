import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';
import {DateUtils} from './date';
import {useStableCallback} from '@rozhkov/react-useful-hooks';

export type DatePickerMonthProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerMonth = ({
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

  return (
    <Picker
      {...restProps}
      value={value.month}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerMonth);
