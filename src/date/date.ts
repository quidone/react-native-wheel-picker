export type OnlyDateFormat = string; // YYYY-MM-DD
export type OnlyDateUnits = {date: number; month: number; year: number};

const toUnits = (date: OnlyDateFormat): OnlyDateUnits => {
  const dateObj = new Date(date);
  return {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth(),
    date: dateObj.getDate(),
  };
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

export const DateUtils = {
  MONTH_COUNT: 12,

  toUnits,
  toOnlyDateFormat,
  getDaysInMonth,
};
