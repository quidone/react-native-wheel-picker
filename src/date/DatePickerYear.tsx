import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';

const HocPicker = withCommonProps(Picker);

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
  const localeData = useDatePickerLocale();
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
    unitPositions: localeData.sortedDateUnitTypes,
    propStyle: overlayItemStyleProp,
  });

  return (
    <HocPicker
      width={width}
      overlayItemStyle={overlayItemStyle}
      {...restProps}
      value={value.year}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerYear);
