import React, {useState} from 'react';
import withExamplePickerConfig from '../picker-config/withExamplePickerConfig';
import WheelPicker, {PickerItem} from '@quidone/react-native-wheel-picker';
import {useInit} from '@rozhkov/react-useful-hooks';

const ExampleWheelPicker = withExamplePickerConfig(WheelPicker);
const createPickerItem = (index: number): PickerItem<number> => ({
  value: index,
  label: index.toString(),
});

const SimplePicker = () => {
  const data = useInit(() =>
    [...Array(100).keys()].map((index) => createPickerItem(index)),
  );
  const [value, setValue] = useState(0);

  return (
    <ExampleWheelPicker
      data={data}
      value={value}
      onValueChanged={({item: {value: val}}) => setValue(val)}
      width={100}
    />
  );
};

export default SimplePicker;
