import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '../base';
import {withPickerControl} from '../picker-control';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';
import {getCalendarAdapter} from './date';
const HocPicker = withCommonProps(withPickerControl(Picker));
export type DatePickerDateProps = Omit<
  PickerProps<{
    value: number;
  }>,
  'value' | 'data'
>;
const DatePickerDate = ({
  width = 60,
  overlayItemStyle: overlayItemStyleProp,
  ...restProps
}: DatePickerDateProps) => {
  const localeData = useDatePickerLocale();
  const dateContext = useDateContext();
  const value = dateContext.value;
  const adapter = getCalendarAdapter(localeData.calendar);
  const daysInMonth = adapter.getDaysInMonth(value.year, value.month);
  const data = useMemo(() => {
    return [...Array(daysInMonth).keys()].map((index) => ({
      value: index + 1,
    }));
  }, [daysInMonth]);
  const overlayItemStyle = useOverlayItemStyle({
    curUnit: 'date',
    unitPositions: localeData.sortedDateUnitTypes,
    propStyle: overlayItemStyleProp,
  });
  return (
    <HocPicker
      width={width}
      overlayItemStyle={overlayItemStyle}
      {...restProps}
      pickerName={'date'}
      control={dateContext.pickerControl}
      value={value.date}
      data={data}
    />
  );
};
export default memo(DatePickerDate);
