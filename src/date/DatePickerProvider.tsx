import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  DateLocale,
  DateUnitType,
  DateUtils,
  type OnlyDateFormat,
  type OnlyDateUnits,
} from './date';

type ContextValue = {
  value: OnlyDateUnits;
  max: Date;
  min: Date;
  unitPosition: DateUnitType[];
  onDateUnitsChanged: (date: OnlyDateUnits) => void;
};

const DatePickerContext = createContext<ContextValue | undefined>(undefined);

type DatePickerProviderProps = PropsWithChildren<{
  date: OnlyDateFormat;
  locale?: DateLocale;
  minDate?: OnlyDateFormat;
  maxDate?: OnlyDateFormat;
  onDateChanged: (event: {date: OnlyDateFormat}) => void;
}>;

const DatePickerProvider = ({
  date,
  locale,
  maxDate,
  minDate,
  onDateChanged,
  children,
}: DatePickerProviderProps) => {
  const {min, max} = useMemo(() => {
    const now = new Date();
    return {
      max: maxDate
        ? new Date(maxDate)
        : new Date(now.getFullYear() + 100, 1, 1),
      min: minDate
        ? new Date(minDate)
        : new Date(now.getFullYear() - 100, 1, 1),
    };
  }, [maxDate, minDate]);

  const onDateUnitsChanged = useStableCallback((dateUnits: OnlyDateUnits) => {
    onDateChanged?.({date: DateUtils.toOnlyDateFormat(dateUnits)});
  });

  const value = useMemo<ContextValue>(
    () => ({
      value: DateUtils.toUnits(date),
      unitPosition: DateUtils.getSortedDateUnitPositions(
        locale ?? {locale: 'en'},
      ),
      max,
      min,
      onDateUnitsChanged,
    }),
    [date, locale, max, min, onDateUnitsChanged],
  );

  return (
    <DatePickerContext.Provider value={value}>
      {children}
    </DatePickerContext.Provider>
  );
};

export default DatePickerProvider;

export const useDateContext = () => {
  const value = useContext(DatePickerContext)!;
  if (value === undefined) {
    throw new Error(
      'useDateContext must be called from within DatePicker.Provider!',
    );
  }
  return useContext(DatePickerContext)!;
};
