import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  DateLocale,
  DateUtils,
  type OnlyDateFormat,
  type OnlyDateUnits,
} from './date';

type ContextValue = {
  value: OnlyDateUnits;
  max: Date;
  min: Date;
  onDateUnitsChanged: (date: OnlyDateUnits) => void;
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
      max,
      min,
      onDateUnitsChanged,
    }),
    [date, max, min, onDateUnitsChanged],
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
