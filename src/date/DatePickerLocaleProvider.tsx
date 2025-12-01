import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {type CalendarType, type DateUnitType, getCalendarAdapter} from './date';
type ContextValue = {
  locale: string;
  calendar: CalendarType;
  sortedDateUnitTypes: DateUnitType[];
  monthLongNames: string[];
};
const DatePickerLocaleContext = createContext<ContextValue | undefined>(
  undefined,
);
type DatePickerLocaleProviderProps = PropsWithChildren<{
  locale?: string;
  calendar?: CalendarType;
}>;
const DatePickerLocaleProvider = ({
  locale = 'en',
  calendar = 'gregorian',
  children,
}: DatePickerLocaleProviderProps) => {
  const value = useMemo<ContextValue>(() => {
    const adapter = getCalendarAdapter(calendar);
    return {
      locale,
      calendar,
      monthLongNames: adapter.getLocalizedMonthNames(locale),
      sortedDateUnitTypes: adapter.getSortedDateUnitPositions(locale),
    };
  }, [locale, calendar]);
  return (
    <DatePickerLocaleContext.Provider value={value}>
      {children}
    </DatePickerLocaleContext.Provider>
  );
};
export default DatePickerLocaleProvider;
export const useDatePickerLocale = () => {
  const value = useContext(DatePickerLocaleContext);
  if (value === undefined) {
    throw new Error(
      'useDatePickerLocale must be called from within DatePickerLocaleContext.Provider!',
    );
  }
  return useContext(DatePickerLocaleContext)!;
};
