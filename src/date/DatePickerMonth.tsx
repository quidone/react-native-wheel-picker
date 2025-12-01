import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '../base';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';
import {DateUtils} from './date';
import {withPickerControl} from '../picker-control';
const HocPicker = withCommonProps(withPickerControl(Picker));
export type DatePickerMonthProps = Omit<
  PickerProps<{
    value: number;
  }>,
  'value' | 'data'
>;
const DatePickerMonth = ({
  width = 120,
  overlayItemStyle: overlayItemStyleProp,
  ...restProps
}: DatePickerMonthProps) => {
  const localeData = useDatePickerLocale();
  const dateContext = useDateContext();
  const value = dateContext.value;
  const data = useMemo(() => {
    return [...Array(DateUtils.MONTH_COUNT).keys()].map((index) => ({
      value: index,
      label: localeData.monthLongNames[index],
    }));
  }, [localeData.monthLongNames]);
  const overlayItemStyle = useOverlayItemStyle({
    curUnit: 'month',
    unitPositions: localeData.sortedDateUnitTypes,
    propStyle: overlayItemStyleProp,
  });
  return (
    <HocPicker
      width={width}
      overlayItemStyle={overlayItemStyle}
      {...restProps}
      pickerName={'month'}
      control={dateContext.pickerControl}
      value={value.month}
      data={data}
    />
  );
};
export default memo(DatePickerMonth);
