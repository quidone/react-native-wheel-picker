import {Text, View} from 'react-native';
import {DatePicker} from '@quidone/react-native-wheel-picker';
import React, {memo, useState} from 'react';

// const DatePickerExample = () => {
//   const [date, setDate] = useState('2024-02-02');
//
//   return <DatePicker date={date} onDateChanged={({date}) => setDate(date)} />;
// };

const insertBetween = <ArrItemT, InsertItemT>(
  arr: ArrItemT[],
  insertItem: InsertItemT,
): (ArrItemT | InsertItemT)[] => {
  const result: (ArrItemT | InsertItemT)[] = [...arr];
  const arrLength = arr.length;
  for (let i = arrLength - 1; i > 0; i--) {
    console.log('i', i);
    result.splice(i, 0, insertItem);
  }
  console.log('result', result);
  return result;
};

const DatePickerSeparator = () => {
  return (
    <View
      style={{
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 40,
          lineHeight: 40,
          paddingHorizontal: 4,
          color: 'gray',
        }}
      >
        :
      </Text>
    </View>
  );
};

const DatePickerExample = () => {
  const [date, setDate] = useState('2024-02-02');

  return (
    <DatePicker
      locale={'ru'}
      date={date}
      onDateChanged={({date}) => setDate(date)}
      itemHeight={30}
      visibleItemCount={7}
      readOnly={true}
      enableScrollByTapOnItem
      //   scrollEventThrottle,
      //   pickerStyle,
      //   itemTextStyle,
      //   overlayItemStyle,
      //   contentContainerStyle,

      renderYear={() => (
        <DatePicker.Year overlayItemStyle={{borderRadius: 8}} />
      )}
      renderMonth={() => (
        <DatePicker.Month overlayItemStyle={{borderRadius: 8}} />
      )}
      renderDate={() => (
        <DatePicker.Date overlayItemStyle={{borderRadius: 8}} />
      )}
    >
      {({dateNodes}) => {
        const preparedNodes = insertBetween(dateNodes, {
          type: 'separator',
          node: <DatePickerSeparator />,
        });

        return preparedNodes.map((x) => x.node);
      }}
    </DatePicker>
  );
};

export default memo(DatePickerExample);
