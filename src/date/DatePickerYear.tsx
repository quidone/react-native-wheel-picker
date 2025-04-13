import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';

export type DatePickerYearProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerYear = ({
  width = 100,
  overlayItemStyle: overlayItemStyleProp,
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

  const overlayItemStyle = useOverlayItemStyle({
    curUnit: 'year',
    unitPositions: dateContext.unitPosition,
    propStyle: overlayItemStyleProp,
  });

  return (
    <Picker
      {...restProps}
      value={value.year}
      data={data}
      width={width}
      overlayItemStyle={overlayItemStyle}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerYear);
