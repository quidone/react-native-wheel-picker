import {View} from 'react-native';
import {DatePicker} from '@quidone/react-native-wheel-picker';
import React, {memo, useState} from 'react';

const DatePickerExample = () => {
  const [date, setDate] = useState('2024-02-02');

  console.log('date', date);

  return (
    <View style={{flexDirection: 'row'}}>
      <DatePicker.Provider
        date={date}
        onDateChanged={({date}) => setDate(date)}
      >
        <DatePicker.Container>
          {({dateNodes}) => {
            return dateNodes.map((node) => node.node);
          }}
        </DatePicker.Container>
        {/* <DatePicker.Date
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
        /> */}
      </DatePicker.Provider>
    </View>
  );
};

export default memo(DatePickerExample);
