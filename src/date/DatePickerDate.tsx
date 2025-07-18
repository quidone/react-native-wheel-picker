import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '@implementation/base';
import {withPickerControl} from '@implementation/picker-control';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {DateUtils} from './date';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';

const HocPicker = withCommonProps(withPickerControl(Picker));

export type DatePickerDateProps = Omit<
  PickerProps<{value: number}>,
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
  const daysInMount = DateUtils.getDaysInMonth(value.year, value.month);
  const data = useMemo(() => {
    return [...Array(daysInMount).keys()].map((index) => ({
      value: index + 1,
    }));
  }, [daysInMount]);

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
