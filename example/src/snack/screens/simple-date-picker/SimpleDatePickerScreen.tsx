import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {DatePicker} from '@quidone/react-native-wheel-picker';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {Divider, PickerScreenViewContainer} from '../../ui-base';
import {
  PickerPropsChangerPanel,
  PickerPropsChangerProvider,
} from '../../props-changer';
import withPropsChanger from '../../props-changer/withPropsChanger';

const ExampleDatePicker = withPropsChanger(DatePicker);

const SimpleDatePickerScreen = () => {
  const [date, setDate] = useState('2025-02-02');

  const onDateChanged = useStableCallback(({date}: {date: string}) => {
    setDate(date);
  });

  return (
    <PickerPropsChangerProvider>
      <PickerScreenViewContainer>
        <Divider />
        <View style={{alignItems: 'center'}}>
          <ExampleDatePicker date={date} onDateChanged={onDateChanged} />
          <Text>value: "{date}"</Text>
        </View>
        <PickerPropsChangerPanel
          hideVirtualized={true}
          hideImpact={true}
          hideSound={true}
        />
      </PickerScreenViewContainer>
    </PickerPropsChangerProvider>
  );
};

export default SimpleDatePickerScreen;
