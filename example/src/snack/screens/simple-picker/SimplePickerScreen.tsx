import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import {useInit} from '@rozhkov/react-useful-hooks';
import WheelPicker, {
  PickerItem,
  type ValueChangedEvent,
} from '@quidone/react-native-wheel-picker';

import {Divider, PickerScreenViewContainer} from '../../ui-base';
import PickerPropsChangerProvider from '../../props-changer/PickerPropsChangerProvider';
import PickerPropsChangerPanel from '../../props-changer/PickerPropsChangerPanel';
import withPropsChanger from '../../props-changer/withPropsChanger';

const ExampleWheelPicker = withPropsChanger(WheelPicker);
const createPickerItem = (index: number): PickerItem<number> => ({
  value: index,
  label: index.toString(),
});

const SimplePickerScreen = () => {
  const data = useInit(() => [...Array(100).keys()].map(createPickerItem));
  const [value, setValue] = useState(0);

  const onValueChanged = useCallback(
    ({item: {value: val}}: ValueChangedEvent<PickerItem<number>>) => {
      setValue(val);
    },
    [],
  );

  return (
    <PickerPropsChangerProvider>
      <PickerScreenViewContainer>
        <Divider />
        <View style={{alignItems: 'center'}}>
          <ExampleWheelPicker
            data={data}
            value={value}
            onValueChanged={onValueChanged}
            width={100}
          />
          <Text>value: "{value}"</Text>
        </View>
        <PickerPropsChangerPanel />
      </PickerScreenViewContainer>
    </PickerPropsChangerProvider>
  );
};

export default memo(SimplePickerScreen);
