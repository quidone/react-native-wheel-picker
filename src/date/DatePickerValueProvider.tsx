import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {isSameDay} from 'date-fns';
import type {PickerItem} from '@implementation/base';
import {
  type PickerControl,
  useOnPickerValueChangedEffect,
  usePickerControl,
} from '@implementation/picker-control';
import {
  type CalendarType,
  getCalendarAdapter,
  type OnlyDateFormat,
  type OnlyDateUnits,
} from './date';

type ContextValue = {
  pickerControl: PickerControl;
  value: OnlyDateUnits;
  max: Date;
  min: Date;
  calendar: CalendarType;
};

type ControlPickersMap = {
  year: {item: PickerItem<number>};
  month: {item: PickerItem<number>};
  date: {item: PickerItem<number>};
};

const DatePickerContext = createContext<ContextValue | undefined>(undefined);

type DatePickerValueProviderProps = PropsWithChildren<{
  date: OnlyDateFormat;
  minDate?: OnlyDateFormat;
  maxDate?: OnlyDateFormat;
  calendar?: CalendarType;
  onDateChanged: (event: {date: OnlyDateFormat}) => void;
}>;

const DatePickerValueProvider = ({
  date,
  maxDate,
  minDate,
  calendar = 'gregorian',
  onDateChanged,
  children,
}: DatePickerValueProviderProps) => {
  const adapter = getCalendarAdapter(calendar);

  const {min, max} = useMemo(() => {
    const now = new Date();

    const getMaxDefault = () => {
      const year = now.getFullYear() + 100;
      const month = 11;
      return new Date(year, month, 31);
    };
    const getMinDefault = () => new Date(now.getFullYear() - 100, 0, 1);

    const maxBoundary = maxDate
      ? adapter.toDate(adapter.toUnits(maxDate))
      : getMaxDefault();
    const minBoundary = minDate
      ? adapter.toDate(adapter.toUnits(minDate))
      : getMinDefault();

    return {max: maxBoundary, min: minBoundary};
  }, [adapter, maxDate, minDate]);

  const pickerControl = usePickerControl<ControlPickersMap>();

  useOnPickerValueChangedEffect(pickerControl, (event) => {
    const nextUnits: OnlyDateUnits = {
      year: event.pickers.year.item.value,
      month: event.pickers.month.item.value,
      date: event.pickers.date.item.value,
    };

    const daysInCurMonth = adapter.getDaysInMonth(
      nextUnits.year,
      nextUnits.month,
    );
    if (daysInCurMonth < nextUnits.date) {
      nextUnits.date = daysInCurMonth;
    }

    const curDateObj = adapter.toDate(adapter.toUnits(date));
    const nextDateObj = adapter.toDate(nextUnits);

    const clampedTime = (() => {
      if (nextDateObj.getTime() < min.getTime()) return min;
      if (nextDateObj.getTime() > max.getTime()) return max;
      return nextDateObj;
    })();

    if (isSameDay(curDateObj, clampedTime)) {
      return;
    }

    let resultUnits: OnlyDateUnits;
    if (calendar === 'gregorian') {
      resultUnits = {
        year: clampedTime.getFullYear(),
        month: clampedTime.getMonth(),
        date: clampedTime.getDate(),
      };
    } else {
      resultUnits = nextUnits;
    }

    onDateChanged?.({
      date: adapter.toOnlyDateFormat(resultUnits),
    });
  });

  const value = useMemo<ContextValue>(
    () => ({
      pickerControl,
      value: adapter.toUnits(date),
      max,
      min,
      calendar,
    }),
    [adapter, calendar, date, max, min, pickerControl],
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
