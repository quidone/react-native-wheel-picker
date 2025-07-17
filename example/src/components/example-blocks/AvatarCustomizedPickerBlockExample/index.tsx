import React, {memo, useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import WheelPicker, {
  PickerItem,
  RenderItem,
  RenderItemContainer,
  RenderOverlay,
  type ValueChangedEvent,
} from '@quidone/react-native-wheel-picker';
import {useInit} from '@rozhkov/react-useful-hooks';
import {faker} from '@faker-js/faker';
import {withExamplePickerConfig} from '../../../picker-config';
import {Header} from '../../base';
import PickerItemContainer from './PickerItemContainer';
import PickerItemComponent from './PickerItem';
import Overlay from './Overlay';
import type {CusPickerItem} from './types';

const ExampleWheelPicker = withExamplePickerConfig(WheelPicker);
const createPickerItem = (index: number): CusPickerItem => {
  const sex = index % 2 === 0 ? 'male' : 'female';

  return {
    value: {
      firstName: faker.person.firstName(sex),
      lastName: faker.person.lastName(sex),
      job: faker.person.jobTitle(),
      avatarUrl: `https://randomuser.me/api/portraits/${sex === 'male' ? 'men' : 'women'}/${index % 50}.jpg`, // eslint-disable-line prettier/prettier
    },
  };
};

const renderItem: RenderItem<PickerItem<any>> = (props) => (
  <PickerItemComponent {...props} />
);
const renderItemContainer: RenderItemContainer<PickerItem<any>> = (props) => (
  <PickerItemContainer {...props} />
);
const renderOverlay: RenderOverlay = (props) => <Overlay {...props} />;

const CustomizedPicker = () => {
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
      <Header title={'Customized Picker'} />
      <View style={styles.outerContainer}>
        <ExampleWheelPicker
          data={data}
          value={value}
          onValueChanged={onValueChanged}
          renderItem={renderItem}
          renderItemContainer={renderItemContainer}
          renderOverlay={renderOverlay}
          itemHeight={60}
          style={styles.picker}
          contentContainerStyle={styles.contentContainerStyle}
          enableScrollByTapOnItem={true}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {width: '100%'},
  picker: {marginTop: 20, overflow: 'visible'},
  contentContainerStyle: {paddingLeft: 32},
});

export default memo(CustomizedPicker);
