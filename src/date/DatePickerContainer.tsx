import React, {Fragment, type ReactNode} from 'react';
import {View} from 'react-native';
import DatePickerDate from './DatePickerDate';
import DatePickerMonth from './DatePickerMonth';
import DatePickerYear from './DatePickerYear';
import {useDatePickerLocale} from './DatePickerLocaleProvider';
export type DateNodeType = 'date' | 'month' | 'year';
type DatePickerContainerProps = {
  renderDate?: () => ReactNode;
  renderMonth?: () => ReactNode;
  renderYear?: () => ReactNode;
  children: (props: {
    dateNodes: {
      node: ReactNode;
      type: DateNodeType;
    }[];
  }) => ReactNode;
};
const DatePickerContainer = ({
  renderDate = () => <DatePickerDate />,
  renderMonth = () => <DatePickerMonth />,
  renderYear = () => <DatePickerYear />,
  children,
}: DatePickerContainerProps) => {
  const localeData = useDatePickerLocale();
  const typeToRenderMap: Record<DateNodeType, () => ReactNode> = {
    date: renderDate,
    month: renderMonth,
    year: renderYear,
  };
  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      {children({
        dateNodes: localeData.sortedDateUnitTypes.map((type) => ({
          type,
          node: <Fragment key={type}>{typeToRenderMap[type]()}</Fragment>,
        })),
      })}
    </View>
  );
};
export default DatePickerContainer;
