import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {DatePicker} from '@quidone/react-native-wheel-picker';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {Button} from 'react-native-elements';
import {Divider, PickerScreenViewContainer} from '../../ui-base';
import {
  PickerPropsChangerPanel,
  PickerPropsChangerProvider,
} from '../../props-changer';
import withPropsChanger from '../../props-changer/withPropsChanger';
import LocaleRow, {LOCALE_DEFAULT} from './LocaleRow';

const generateRandomDate = (): string => {
  const currentDate = new Date();
  const tenYearsInMilliseconds = 10 * 365 * 24 * 60 * 60 * 1000;

  const randomTimestamp =
    currentDate.getTime() + Math.floor(Math.random() * tenYearsInMilliseconds);

  const randomDate = new Date(randomTimestamp);

  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const ExampleDatePicker = withPropsChanger(DatePicker);

const SimpleDatePickerScreen = () => {
  const [date, setDate] = useState('2025-02-02');
  const [locale, setLocale] = useState(LOCALE_DEFAULT);

  const onDateChanged = useStableCallback(({date}: {date: string}) => {
    setDate(date);
  });

  return (
    <PickerPropsChangerProvider>
      <PickerScreenViewContainer>
        <Divider />
        <View style={{alignItems: 'center'}}>
          <ExampleDatePicker
            date={date}
            onDateChanged={onDateChanged}
            locale={locale}
            minDate={'2000-01-05'}
          />
          <Text>value: "{date}"</Text>
          <View style={{flexDirection: 'row'}}>
            <Button
              type={'clear'}
              title={'1900-01-01'}
              onPress={() => setDate('1900-01-01')}
            />
            <Button
              type={'clear'}
              title={'Random date'}
              onPress={() => setDate(generateRandomDate())}
            />
            <Button
              type={'clear'}
              title={'2200-01-01'}
              onPress={() => setDate('2200-01-01')}
            />
          </View>
        </View>
        <LocaleRow selected={locale} onChange={setLocale} />
        <PickerPropsChangerPanel
          style={{paddingTop: 0}}
          hideVirtualized={true}
          hideImpact={true}
          hideSound={true}
        />
      </PickerScreenViewContainer>
    </PickerPropsChangerProvider>
  );
};

export default SimpleDatePickerScreen;
