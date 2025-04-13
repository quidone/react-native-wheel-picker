import React, {ReactNode} from 'react';
import {DateLocale, DateUtils} from './date';
import DatePickerDate from './DatePickerDate';
import DatePickerMonth from './DatePickerMonth';
import DatePickerYear from './DatePickerYear';

type DateNodeType = 'date' | 'month' | 'year';

type DatePickerContainerProps = {
  renderDate?: () => ReactNode;
  renderMonth?: () => ReactNode;
  renderYear?: () => ReactNode;
  locale?: DateLocale;

  children: (props: {
    dateNodes: {node: ReactNode; type: DateNodeType}[];
  }) => ReactNode;
};

const DatePickerContainer = ({
  locale,
  renderDate = () => <DatePickerDate />,
  renderMonth = () => <DatePickerMonth />,
  renderYear = () => <DatePickerYear />,
  children,
}: DatePickerContainerProps) => {
  const typeToRenderMap: Record<DateNodeType, () => ReactNode> = {
    date: renderDate,
    month: renderMonth,
    year: renderYear,
  };
  const sortedDateUnitTypes: DateNodeType[] =
    DateUtils.getSortedDateUnitPositions(locale ?? {locale: 'en'});

  return (
    <>
      {children({
        dateNodes: sortedDateUnitTypes.map((type) => ({
          type,
          node: typeToRenderMap[type](),
        })),
      })}
    </>
  );
};

export default DatePickerContainer;
