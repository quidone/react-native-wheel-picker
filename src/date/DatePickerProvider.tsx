import React, {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {DateUtils, type OnlyDateFormat, type OnlyDateUnits} from './date';

type ContextValue = {
  value: OnlyDateUnits;
  onDateUnitsChanged: (date: OnlyDateUnits) => void;
  max: Date;
  min: Date;
};

const DatePickerContext = createContext<ContextValue | undefined>(undefined);

type DatePickerProviderProps = PropsWithChildren<{
  date: OnlyDateFormat;
  onDateChanged: (event: {date: OnlyDateFormat}) => void;
  minDate?: OnlyDateFormat;
  maxDate?: OnlyDateFormat;
}>;

const DatePickerProvider = ({
  date,
  onDateChanged,
  maxDate,
  minDate,
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
      onDateUnitsChanged,
      max,
      min,
    }),
    [date, max, min, onDateUnitsChanged],
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
