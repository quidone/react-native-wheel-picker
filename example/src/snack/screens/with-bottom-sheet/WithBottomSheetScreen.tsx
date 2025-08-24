import React, {memo, useCallback, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {
  DatePickerBottomSheet,
  type DatePickerBottomSheetRef,
} from './DatePickerBottomSheet';

const WithBottomSheetScreen = () => {
  const [date, setDate] = useState('2025-01-05');
  const datePickerRef = useRef<DatePickerBottomSheetRef>(null);

  const openDatePicker = useCallback(() => {
    datePickerRef.current?.open();
  }, []);

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 18, marginBottom: 20}}>
        Selected date: {date}
      </Text>
      <Button title={'Select date'} onPress={openDatePicker} />
      <DatePickerBottomSheet
        ref={datePickerRef}
        initialDate={date}
        onDateConfirmed={handleDateChange}
      />
    </View>
  );
};

export default memo(WithBottomSheetScreen);
