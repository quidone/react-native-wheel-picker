import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';

export type DatePickerYearProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerYear = ({
  onValueChanged: onValueChangedProp,
  ...restProps
}: DatePickerYearProps) => {
  const dateContext = useDateContext();
  const value = dateContext.value;
  const data = useMemo(() => {
    const startYear = dateContext.min.getFullYear();
    const endYear = dateContext.max.getFullYear();
    return Array.from({length: endYear - startYear + 1}, (_, index) => ({
      value: startYear + index,
    }));
  }, [dateContext.max, dateContext.min]);

  const onValueChanged = useStableCallback<
    DatePickerYearProps['onValueChanged']
  >((event) => {
    dateContext.onDateUnitsChanged({...value, year: event.item.value});
    onValueChangedProp?.(event);
  });

  return (
    <Picker
      {...restProps}
      value={value.year}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerYear);
