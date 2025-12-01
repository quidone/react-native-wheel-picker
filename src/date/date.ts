/**
 * Internal, calendar-agnostic date representations.
 *
 * By default the library uses the Gregorian calendar, but we also support
 * the Persian (Jalali) calendar via a thin adapter layer.
 */

export type OnlyDateFormat = string; // YYYY-MM-DD
export type OnlyDateUnits = {date: number; month: number; year: number};

export type DateUnitType = 'date' | 'month' | 'year';

export type DateLocale = {
  locale: string;
};

export type CalendarType = 'gregorian' | 'persian';

export type CalendarAdapter = {
  calendar: CalendarType;
  /**
   * Convert calendar-specific date string (YYYY-MM-DD) to calendar units.
   */
  toUnits: (date: OnlyDateFormat) => OnlyDateUnits;
  /**
   * Convert calendar units to a calendar-specific date string (YYYY-MM-DD).
   */
  toOnlyDateFormat: (units: OnlyDateUnits) => OnlyDateFormat;
  /**
   * Convert calendar units to a real JS Date for comparison / clamping.
   */
  toDate: (units: OnlyDateUnits) => Date;
  /**
   * Number of days in a given month of a given year for this calendar.
   */
  getDaysInMonth: (year: number, month: number) => number;
  /**
   * Localized month names (index 0-11).
   */
  getLocalizedMonthNames: (locale: string) => string[];
  /**
   * Order of date units based on locale (e.g. ['year','month','date']).
   */
  getSortedDateUnitPositions: (locale: string) => DateUnitType[];
};

// region Gregorian (existing behaviour)
const gregorianToUnits = (date: OnlyDateFormat | Date): OnlyDateUnits => {
  const dateObj = new Date(date);
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
    date: dateObj.getDate(),
  };
};

const gregorianToDate = (units: OnlyDateUnits): Date => {
  return new Date(units.year, units.month, units.date);
};

const gregorianToOnlyDateFormat = (units: OnlyDateUnits): OnlyDateFormat => {
  const date = gregorianToDate(units);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-11 -> 1-12
  const day = date.getDate();

  const monthFormatted = month < 10 ? `0${month}` : String(month);
  const dayFormatted = day < 10 ? `0${day}` : String(day);

  return `${year}-${monthFormatted}-${dayFormatted}`;
};

const gregorianGetDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const gregorianGetSortedDateUnitPositions = (
  locale: string,
): DateUnitType[] => {
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

  const order: DateUnitType[] = [];
  parts.forEach((part) => {
    if (part.type in orderMap) {
      order.push(orderMap[part.type as keyof typeof orderMap]!);
    }
  });

  return order;
};

const gregorianGetLocalizedMonthNames = (locale: string): string[] => {
  const monthNames: string[] = [];
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const date = new Date(2025, monthIndex, 1);
    const formatter = new Intl.DateTimeFormat(locale, {month: 'long'});
    const monthName = formatter.format(date);
    monthNames.push(monthName);
  }
  return monthNames;
};

export const GregorianCalendarAdapter: CalendarAdapter = {
  calendar: 'gregorian',
  toUnits: (date) => gregorianToUnits(date),
  toOnlyDateFormat: (units) => gregorianToOnlyDateFormat(units),
  toDate: (units) => gregorianToDate(units),
  getDaysInMonth: (year, month) => gregorianGetDaysInMonth(year, month),
  getLocalizedMonthNames: (locale) => gregorianGetLocalizedMonthNames(locale),
  getSortedDateUnitPositions: (locale) =>
    gregorianGetSortedDateUnitPositions(locale),
};
// endregion

// region Persian (Jalali) calendar adapter
// Using jalaali-js library (MIT license) for accurate date conversions
// eslint-disable-next-line @typescript-eslint/no-require-imports, eslint-comments/no-unused-disable
const jalaali = require('jalaali-js');

const PERSIAN_MONTH_NAMES_FA = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

// Helper functions using jalaali-js
const toGregorianFromJalali = (
  jy: number,
  jm: number,
  jd: number,
): {gy: number; gm: number; gd: number} => {
  return jalaali.toGregorian(jy, jm, jd);
};

const toJalaliFromGregorian = (
  gy: number,
  gm: number,
  gd: number,
): {jy: number; jm: number; jd: number} => {
  return jalaali.toJalaali(gy, gm, gd);
};

const persianToUnits = (date: OnlyDateFormat): OnlyDateUnits => {
  // date is always Gregorian (YYYY-MM-DD format)
  // Convert Gregorian to Jalali for display
  const [yearStr, monthStr, dayStr] = date.split('-');
  const gy = Number(yearStr);
  const gm = Number(monthStr); // 1-based
  const gd = Number(dayStr);
  const {jy, jm, jd} = toJalaliFromGregorian(gy, gm, gd);
  return {year: jy, month: jm - 1, date: jd}; // month is 0-based
};

const persianToOnlyDateFormat = (units: OnlyDateUnits): OnlyDateFormat => {
  // units are in Jalali calendar, but output must always be Gregorian
  // Convert Jalali back to Gregorian
  const jy = units.year;
  const jm = units.month + 1; // to 1-based
  const jd = units.date;
  const {gy, gm, gd} = toGregorianFromJalali(jy, jm, jd);
  const monthFormatted = gm < 10 ? `0${gm}` : String(gm);
  const dayFormatted = gd < 10 ? `0${gd}` : String(gd);
  return `${gy}-${monthFormatted}-${dayFormatted}`;
};

const persianToDate = (units: OnlyDateUnits): Date => {
  // Convert Jalali date to Gregorian JS Date for comparison and clamping.
  const jy = units.year;
  const jm = units.month + 1;
  const jd = units.date;
  const {gy, gm, gd} = toGregorianFromJalali(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
};

const persianGetDaysInMonth = (year: number, month: number): number => {
  // month is 0-based: 0..11, jalaali-js expects 1-based: 1..12
  return jalaali.jalaaliMonthLength(year, month + 1);
};

const persianGetLocalizedMonthNames = (locale: string): string[] => {
  if (locale.startsWith('fa')) {
    return [...PERSIAN_MONTH_NAMES_FA];
  }
  // Fallback: still use Persian names; consumers can override labels if needed.
  return [...PERSIAN_MONTH_NAMES_FA];
};

const persianGetSortedDateUnitPositions = (locale: string): DateUnitType[] => {
  // برای فارسی معمولاً سال/ماه/روز است
  if (locale.startsWith('fa')) {
    return ['year', 'month', 'date'];
  }
  // Otherwise, fall back to Gregorian ordering for that locale.
  return gregorianGetSortedDateUnitPositions(locale);
};

export const PersianCalendarAdapter: CalendarAdapter = {
  calendar: 'persian',
  toUnits: (date) => persianToUnits(date),
  toOnlyDateFormat: (units) => persianToOnlyDateFormat(units),
  toDate: (units) => persianToDate(units),
  getDaysInMonth: (year, month) => persianGetDaysInMonth(year, month),
  getLocalizedMonthNames: (locale) => persianGetLocalizedMonthNames(locale),
  getSortedDateUnitPositions: (locale) =>
    persianGetSortedDateUnitPositions(locale),
};
// endregion

export const getCalendarAdapter = (calendar: CalendarType): CalendarAdapter => {
  return calendar === 'persian'
    ? PersianCalendarAdapter
    : GregorianCalendarAdapter;
};

// region legacy helpers (backward-compatible, Gregorian only)

const withBoundaries = (date: Date, min: Date, max: Date) => {
  if (date.getTime() < min.getTime()) {
    date = min;
  } else if (date.getTime() > max.getTime()) {
    date = max;
  }
  return date;
};

const inRange = (units: OnlyDateUnits, start: Date, end: Date) => {
  const valueTime = gregorianToDate(units).getTime();
  const startTime = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  ).getTime();
  const endTime = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate(),
  ).getTime();
  return valueTime >= startTime && valueTime <= endTime;
};

export const DateUtils = {
  MONTH_COUNT: 12,

  toUnits: gregorianToUnits,
  toDate: gregorianToDate,
  toOnlyDateFormat: gregorianToOnlyDateFormat,
  inRange,
  withBoundaries,
  getDaysInMonth: gregorianGetDaysInMonth,
  getSortedDateUnitPositions: gregorianGetSortedDateUnitPositions,
  getLocalizedMonthNames: gregorianGetLocalizedMonthNames,
  isFirstUnitPosition: (list: DateUnitType[], search: DateUnitType) =>
    list[0] === search,
  isLastUnitPosition: (list: DateUnitType[], search: DateUnitType) =>
    list.at(-1) === search,
};
// endregion
