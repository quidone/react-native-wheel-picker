import React, {memo, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WheelPicker, {
  type PickerItem,
  useOnPickerValueChangedEffect,
  useOnPickerValueChangingEffect,
  usePickerControl,
  withPickerControl,
} from '@quidone/react-native-wheel-picker';
import {Button, Text} from 'react-native-elements';
import {getRandomNumber} from '../../get-random-number';

const PickerWithControl = withPickerControl(WheelPicker);

const generateNumbersArray = (length: number): {value: number}[] => {
  return Array.from({length: length}, (_, index) => ({value: index}));
};

type ControlPickersMap = {
  value1: {item: PickerItem<number>};
  value2: {item: PickerItem<number>};
};

const ControlSimpleUsage = () => {
  const [dataCount, setDataCount] = useState(100);
  const data = useMemo(() => generateNumbersArray(dataCount), [dataCount]);
  const [value, setValue] = useState({value1: 0, value2: 0});

  const pickerControl = usePickerControl<ControlPickersMap>();

  useOnPickerValueChangedEffect(pickerControl, (event) => {
    console.log('[useOnPickerValueChangedEffect]', event);
    setValue({
      value1: event.pickers.value1.item.value,
      value2: event.pickers.value2.item.value,
    });
  });

  useOnPickerValueChangingEffect(pickerControl, (event) => {
    const curValue = {
      value1: event.pickers.value1.item.value,
      value2: event.pickers.value2.item.value,
    };
    console.log('[useOnPickerValueChangingEffect]', curValue, event);
  });

  // Обработчики нажатия на кнопки
  const handleRandomValue1 = () => {
    const randomValue1 = getRandomNumber(value.value1, dataCount);
    setValue({...value, value1: randomValue1});
  };

  const handleRandomValue2 = () => {
    const randomValue2 = getRandomNumber(value.value2, dataCount);
    setValue({...value, value2: randomValue2});
  };

  const handleRandomBothValues = () => {
    const randomValue1 = getRandomNumber(value.value1, dataCount);
    const randomValue2 = getRandomNumber(value.value2, dataCount);
    setValue({value1: randomValue1, value2: randomValue2});
  };

  const changeDataCount = (count: number) => {
    setDataCount(count);
    setValue({value1: 0, value2: 0});
  };

  return (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <PickerWithControl
          control={pickerControl}
          pickerName={'value1'}
          data={data}
          value={value.value1}
          width={100}
          enableScrollByTapOnItem={true}
        />
        <PickerWithControl
          control={pickerControl}
          pickerName={'value2'}
          data={data}
          value={value.value2}
          width={100}
          enableScrollByTapOnItem={true}
        />
      </View>
      <Text style={{textAlign: 'center'}}>
        value: {value.value1}:{value.value2}
      </Text>

      <View style={styles.buttonsContainer}>
        <Button
          onPress={handleRandomValue1}
          title={'Random Value 1'}
          type={'outline'}
        />
        <Button
          onPress={handleRandomValue2}
          title={'Random Value 2'}
          type={'outline'}
        />
        <Button
          onPress={handleRandomBothValues}
          title={'Both Random Values'}
          type={'outline'}
        />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Text style={{flex: 1}}>Data count: {dataCount}</Text>
          <Button
            containerStyle={{flex: 1}}
            style={{flex: 1}}
            title={'set 3'}
            type={'outline'}
            onPress={() => changeDataCount(3)}
          />
          <Button
            containerStyle={{flex: 1}}
            title={'set 100'}
            type={'outline'}
            onPress={() => changeDataCount(100)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 8,
  },
});

export default memo(ControlSimpleUsage);
