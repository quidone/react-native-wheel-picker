import {DatePicker} from '@quidone/react-native-wheel-picker';
import React, {memo, useState} from 'react';
import {View} from 'react-native';

const DatePickerExample = () => {
  const [date, setDate] = useState('2025-01-01');

  console.log('date', date);

  return (
    <View style={{flexDirection: 'row', width: 221}}>
      <DatePicker.Provider
        date={date}
        onDateChanged={({date}) => setDate(date)}
      >
        <DatePicker.Date
          width={60}
          overlayItemStyle={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
        <DatePicker.Month width={60} overlayItemStyle={{borderRadius: 0}} />
        <DatePicker.Year
          width={100}
          overlayItemStyle={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />
      </DatePicker.Provider>
    </View>
  );
};

export default memo(DatePickerExample);
