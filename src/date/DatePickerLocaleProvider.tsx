import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {type DateUnitType, DateUtils} from './date';

type ContextValue = {
  locale: string;
  sortedDateUnitTypes: DateUnitType[];
  monthLongNames: string[];
};

const DatePickerLocaleContext = createContext<ContextValue | undefined>(
  undefined,
);

type DatePickerLocaleProviderProps = PropsWithChildren<{locale?: string}>;

const DatePickerLocaleProvider = ({
  locale = 'en',
  children,
}: DatePickerLocaleProviderProps) => {
  const value = useMemo<ContextValue>(
    () => ({
      locale,
      monthLongNames: DateUtils.getLocalizedMonthNames(locale),
      sortedDateUnitTypes: DateUtils.getSortedDateUnitPositions(locale),
    }),
    [locale],
  );

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
