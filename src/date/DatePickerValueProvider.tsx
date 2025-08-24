import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {getDaysInMonth, isSameDay} from 'date-fns';
import type {PickerItem} from '@implementation/base';
import {
  type PickerControl,
  useOnPickerValueChangedEffect,
  usePickerControl,
} from '@implementation/picker-control';
import {
  type DateLocale,
  DateUtils,
  type OnlyDateFormat,
  type OnlyDateUnits,
} from './date';

type ContextValue = {
  pickerControl: PickerControl;
  value: OnlyDateUnits;
  max: Date;
  min: Date;
};

type ControlPickersMap = {
  year: {item: PickerItem<number>};
  month: {item: PickerItem<number>};
  date: {item: PickerItem<number>};
};

const DatePickerContext = createContext<ContextValue | undefined>(undefined);

type DatePickerValueProviderProps = PropsWithChildren<{
  date: OnlyDateFormat;
  locale?: DateLocale;
  minDate?: OnlyDateFormat;
  maxDate?: OnlyDateFormat;
  onDateChanged: (event: {date: OnlyDateFormat}) => void;
}>;

const DatePickerValueProvider = ({
  date,
  maxDate,
  minDate,
  onDateChanged,
  children,
}: DatePickerValueProviderProps) => {
  const {min, max} = useMemo(() => {
    const now = new Date();

    const getMaxDefault = () => {
      const year = now.getFullYear() + 100;
      const month = 11;
      return new Date(year, month, DateUtils.getDaysInMonth(year, month));
    };
    const getMinDefault = () => new Date(now.getFullYear() - 100, 0, 1);

    return {
      max: maxDate ? new Date(maxDate) : getMaxDefault(),
      min: minDate ? new Date(minDate) : getMinDefault(),
    };
  }, [maxDate, minDate]);

  const pickerControl = usePickerControl<ControlPickersMap>();

  useOnPickerValueChangedEffect(pickerControl, (event) => {
    const nextUnits = {
      year: event.pickers.year.item.value,
      month: event.pickers.month.item.value,
      date: event.pickers.date.item.value,
    };

    const daysInCurMonth = getDaysInMonth(
      new Date(nextUnits.year, nextUnits.month),
    );
    if (daysInCurMonth < nextUnits.date) {
      nextUnits.date = daysInCurMonth;
    }

    const curDateObj = new Date(date);
    const dateObj = new Date(nextUnits.year, nextUnits.month, nextUnits.date);
    const normalizedDateObj = DateUtils.withBoundaries(dateObj, min, max);

    if (isSameDay(curDateObj, normalizedDateObj)) {
      return;
    }

    onDateChanged?.({
      date: DateUtils.toOnlyDateFormat({
        year: normalizedDateObj.getFullYear(),
        month: normalizedDateObj.getMonth(),
        date: normalizedDateObj.getDate(),
      }),
    });
  });

  const value = useMemo<ContextValue>(
    () => ({
      pickerControl,
      value: DateUtils.toUnits(
        DateUtils.withBoundaries(new Date(date), min, max),
      ),
      max,
      min,
    }),
    [pickerControl, date, max, min],
  );

  return (
    <DatePickerContext.Provider value={value}>
      {children}
    </DatePickerContext.Provider>
  );
};

export default DatePickerValueProvider;

export const useDateContext = () => {
  const value = useContext(DatePickerContext);
  if (value === undefined) {
    throw new Error(
      'useDateContext must be called from within DatePicker.Provider!',
    );
  }
  return useContext(DatePickerContext)!;
};
