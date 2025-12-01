import React, {type ReactNode} from 'react';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import DatePickerValueProvider from './DatePickerValueProvider';
import DatePickerDates from './DatePickerDate';
import DatePickerMonth from './DatePickerMonth';
import DatePickerYear from './DatePickerYear';
import DatePickerContainer, {type DateNodeType} from './DatePickerContainer';
import type {OnlyDateFormat} from './date';
import DatePickerLocaleProvider from './DatePickerLocaleProvider';
import DatePickerCommonPropsProvider from './DatePickerCommonPropsProvider';

export type DatePickerProps = {
  date: OnlyDateFormat;
  onDateChanged: (event: {date: OnlyDateFormat}) => void;
  minDate?: OnlyDateFormat;
  maxDate?: OnlyDateFormat;
  locale?: string;
  calendar?: 'gregorian' | 'persian';

  renderDate?: () => ReactNode;
  renderMonth?: () => ReactNode;
  renderYear?: () => ReactNode;
  children?: (props: {
    dateNodes: {node: ReactNode; type: DateNodeType}[];
  }) => ReactNode;

  // region common props for all child wheel pickers
  itemHeight?: number;
  visibleItemCount?: number;
  readOnly?: boolean;
  enableScrollByTapOnItem?: boolean;
  scrollEventThrottle?: number;
  pickerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  fontFamily?: string;
  overlayItemStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  // endregion
};

const DatePickerComponent = ({
  date,
  onDateChanged,
  minDate,
  maxDate,
  locale,
  calendar = 'gregorian',
  renderDate,
  renderMonth,
  renderYear,
  children = ({dateNodes}) => <>{dateNodes.map((dateNode) => dateNode.node)}</>,

  // region common props for all child wheel pickers
  itemHeight,
  visibleItemCount,
  readOnly,
  enableScrollByTapOnItem,
  scrollEventThrottle,
  pickerStyle,
  itemTextStyle,
  fontFamily,
  overlayItemStyle,
  contentContainerStyle,
}: // endregion
DatePickerProps) => {
  return (
    <DatePickerLocaleProvider locale={locale} calendar={calendar}>
      <DatePickerValueProvider
        date={date}
        onDateChanged={onDateChanged}
        minDate={minDate}
        maxDate={maxDate}
        calendar={calendar}
      >
        <DatePickerCommonPropsProvider
          itemHeight={itemHeight}
          visibleItemCount={visibleItemCount}
          readOnly={readOnly}
          enableScrollByTapOnItem={enableScrollByTapOnItem}
          scrollEventThrottle={scrollEventThrottle}
          pickerStyle={pickerStyle}
          itemTextStyle={itemTextStyle}
          fontFamily={fontFamily}
          overlayItemStyle={overlayItemStyle}
          contentContainerStyle={contentContainerStyle}
        >
          <DatePickerContainer
            renderDate={renderDate}
            renderMonth={renderMonth}
            renderYear={renderYear}
          >
            {children}
          </DatePickerContainer>
        </DatePickerCommonPropsProvider>
      </DatePickerValueProvider>
    </DatePickerLocaleProvider>
  );
};

DatePickerComponent.displayName = 'DatePicker';

export const DatePicker = Object.assign(DatePickerComponent, {
  Date: DatePickerDates,
  Month: DatePickerMonth,
  Year: DatePickerYear,
});
