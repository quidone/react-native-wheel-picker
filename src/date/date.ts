import {isAfter, isBefore, isWithinInterval, startOfDay} from 'date-fns';

export type OnlyDateFormat = string; // YYYY-MM-DD
export type OnlyDateUnits = {date: number; month: number; year: number};

const withBoundaries = (date: Date, min: Date, max: Date) => {
  if (isBefore(date, min)) {
    date = min;
  } else if (isAfter(date, max)) {
    date = max;
  }
  return date;
};

const toUnits = (date: OnlyDateFormat | Date): OnlyDateUnits => {
  let dateObj = new Date(date);

  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
    date: dateObj.getDate(),
  };
};

const inRange = (units: OnlyDateUnits, start: Date, end: Date) => {
  return isWithinInterval(toDate(units), {
    start: startOfDay(start),
    end: startOfDay(end),
  });
};

const toDate = (units: OnlyDateUnits) => {
  return new Date(units.year, units.month, units.date);
};

const toOnlyDateFormat = (units: OnlyDateUnits): OnlyDateFormat => {
  const date = new Date(units.year, units.month, units.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  // Pad single digit month and day with leading zeros
  const monthFormatted = month < 10 ? `0${month}` : month;
  const dayFormatted = day < 10 ? `0${day}` : day;

  return `${year}-${monthFormatted}-${dayFormatted}`;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export type DateUnitType = 'date' | 'month' | 'year';

export type DateLocale = {
  locale: string;
};

const getSortedDateUnitPositions = (locale: string) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const parts = formatter.formatToParts(new Date());
  const orderMap: Record<string, DateUnitType> = {
    day: 'date',
    month: 'month',
    year: 'year',
  };

  // Создаем массив с правильным порядком элементов
  const order: DateUnitType[] = [];
  parts.forEach((part) => {
    // part - это объект {type: string, value: string}
    if (part.type in orderMap) {
      order.push(orderMap[part.type as keyof typeof orderMap]!);
    }
  });

  return order;
};

const getLocalizedMonthNames = (locale: string): string[] => {
  const monthNames: string[] = [];
  for (let monthIndex = 0; monthIndex < DateUtils.MONTH_COUNT; monthIndex++) {
    const date = new Date(2025, monthIndex, 1); // Создаем дату для каждого месяца
    const formatter = new Intl.DateTimeFormat(locale, {month: 'long'});
    const monthName = formatter.format(date);
    monthNames.push(monthName);
  }
  return monthNames;
};

const isFirstUnitPosition = (list: DateUnitType[], search: DateUnitType) => {
  return list[0] === search;
};
const isLastUnitPosition = (list: DateUnitType[], search: DateUnitType) => {
  return list.at(-1) === search;
};

export const DateUtils = {
  MONTH_COUNT: 12,

  toUnits,
  toDate,
  toOnlyDateFormat,
  inRange,
  withBoundaries,
  getDaysInMonth,
  getSortedDateUnitPositions,
  getLocalizedMonthNames,
  isFirstUnitPosition,
  isLastUnitPosition,
};
