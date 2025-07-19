import React, {memo, useMemo} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';
import {DateUtils} from './date';

const HocPicker = withCommonProps(Picker);

export type DatePickerMonthProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerMonth = ({
  width = 120,
  overlayItemStyle: overlayItemStyleProp,
  onValueChanged: onValueChangedProp,
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

  const onValueChanged = useStableCallback<
    DatePickerMonthProps['onValueChanged']
  >((event) => {
    dateContext.onDateUnitsChanged({...value, month: event.item.value});
    onValueChangedProp?.(event);
  });

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
      value={value.month}
      data={data}
      onValueChanged={onValueChanged}
    />
  );
};

export default memo(DatePickerMonth);
