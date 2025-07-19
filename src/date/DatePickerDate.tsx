import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {DateUtils} from './date';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';

const HocPicker = withCommonProps(Picker);

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
  const localeData = useDatePickerLocale();
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
    unitPositions: localeData.sortedDateUnitTypes,
    propStyle: overlayItemStyleProp,
  });

  return (
    <HocPicker
      width={width}
      overlayItemStyle={overlayItemStyle}
      {...restProps}
      value={value.date}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerDate);
