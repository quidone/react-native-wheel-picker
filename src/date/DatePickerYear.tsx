import React, {memo, useMemo} from 'react';
import Picker, {type PickerProps} from '@implementation/base';
import {useDateContext} from './DatePickerValueProvider';
import {useOverlayItemStyle} from './useOverlayItemStyle';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
import {withCommonProps} from './DatePickerCommonPropsProvider';
import {withPickerControl} from '@implementation/picker-control';

const HocPicker = withCommonProps(withPickerControl(Picker));

export type DatePickerYearProps = Omit<
  PickerProps<{value: number}>,
  'value' | 'data'
>;

const DatePickerYear = ({
  width = 100,
  overlayItemStyle: overlayItemStyleProp,
  ...restProps
}: DatePickerYearProps) => {
  const localeData = useDatePickerLocale();
  const dateContext = useDateContext();
  const value = dateContext.value;

  const data = useMemo(() => {
    let startYear: number;
    let endYear: number;

    if (localeData.calendar === 'persian') {
      // برای Persian: از محدوده منطقی استفاده می‌کنیم
      // تبدیل تقریبی: سال شمسی ≈ سال میلادی - 621
      const minGregorianYear = dateContext.min.getFullYear();
      const maxGregorianYear = dateContext.max.getFullYear();

      // تبدیل تقریبی به شمسی (با احتیاط)
      startYear = Math.max(1300, minGregorianYear - 621);
      endYear = Math.min(1500, maxGregorianYear - 621);

      // اطمینان از محدوده منطقی
      if (startYear < 1300) startYear = 1300;
      if (endYear > 1500) endYear = 1500;
      if (endYear < startYear) {
        startYear = 1300;
        endYear = 1500;
      }
    } else {
      // Gregorian: مستقیماً از Date استفاده می‌کنیم
      startYear = dateContext.min.getFullYear();
      endYear = dateContext.max.getFullYear();
    }

    return Array.from({length: endYear - startYear + 1}, (_, index) => ({
      value: startYear + index,
    }));
  }, [dateContext.max, dateContext.min, localeData.calendar]);

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
      pickerName={'year'}
      control={dateContext.pickerControl}
      value={value.year}
      data={data}
    />
  );
};

export default memo(DatePickerYear);
