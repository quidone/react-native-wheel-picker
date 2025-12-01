import React, {useState} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {DatePicker} from '@quidone/react-native-wheel-picker';

const CustomizedDatePicker = () => {
  const [date, setDate] = useState('1403-07-15');
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