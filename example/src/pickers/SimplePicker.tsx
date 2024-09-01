import React, {useState} from 'react';
import withExamplePickerConfig from '../picker-config/withExamplePickerConfig';
import WheelPicker, {PickerItem} from '@quidone/react-native-wheel-picker';
import {useInit} from '@rozhkov/react-useful-hooks';
import {RenderScrollView} from 'src/base/types';

const ExampleWheelPicker = withExamplePickerConfig(WheelPicker);
const createPickerItem = (index: number): PickerItem<number> => ({
  value: index,
  label: index.toString(),
});

const SimplePicker = (props: {renderScrollView?: RenderScrollView}) => {
  const data = useInit(() =>
    [...Array(100).keys()].map((index) => createPickerItem(index)),
  );
  const [value, setValue] = useState(0);

  return (
    <ExampleWheelPicker
      renderScrollView={props.renderScrollView as RenderScrollView}
      data={data}
      value={value}
      onValueChanged={({item: {value: val}}) => setValue(val)}
      width={100}
    />
  );
};

export default SimplePicker;
