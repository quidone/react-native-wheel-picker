import React, {useCallback, useState} from 'react';
import WheelPicker, {
  PickerItem,
  type ValueChangedEvent,
} from '@quidone/react-native-wheel-picker';
import {useInit} from '@rozhkov/react-useful-hooks';
import {withExamplePickerConfig, PickerConfigPanel} from '../../picker-config';
import {Header} from '../../snack/ui-base';

const ExampleWheelPicker = withExamplePickerConfig(WheelPicker);
const createPickerItem = (index: number): PickerItem<number> => ({
  value: index,
  label: index.toString(),
});

const SimplePicker = () => {
  const data = useInit(() => [...Array(100).keys()].map(createPickerItem));
  const [value, setValue] = useState(0);

  const onValueChanged = useCallback(
    ({item: {value: val}}: ValueChangedEvent<PickerItem<number>>) => {
      setValue(val);
    },
    [],
  );

  return (
    <>
      <Header title={'Simple Picker'} />
      <ExampleWheelPicker
        data={data}
        value={value}
        onValueChanged={onValueChanged}
        width={100}
        enableScrollByTapOnItem={true}
      />
      <PickerConfigPanel />
    </>
  );
};

export default SimplePicker;
