import React from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {DatePicker} from 'react-native-wheel-picker-plus';

const CustomizedDatePicker = ({date, setDate}: {date: string, setDate: (date: string) => void}) => {

  const onDateChanged = useStableCallback(({date: newDate}: {date: string}) => {
    setDate(newDate);
  });

  return (
    <DatePicker
      date={date}
      onDateChanged={onDateChanged}
      renderDate={() => <DatePicker.Date />}
      renderMonth={() => <DatePicker.Month />}
      renderYear={() => <DatePicker.Year />}
      minDate='2024-05-22'
      locale="fa-IR"
      calendar="persian"
      // use your own font family
      // fontFamily="Vazir" // your font family name
    >
      {({dateNodes}) => {
        return dateNodes.map((x) => x.node);
      }}
    </DatePicker>
  );
};

export default CustomizedDatePicker;