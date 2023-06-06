import React, {memo} from 'react';
import WheelPicker, {
  PickerItem,
  RenderItem,
  RenderItemContainer,
  RenderOverlay,
} from '@quidone/react-native-wheel-picker';
import {useInit} from '@rozhkov/react-useful-hooks';
import {StyleSheet} from 'react-native';
import withExamplePickerConfig from '../../picker-config/withExamplePickerConfig';
import PickerItemContainer from './PickerItemContainer';
import PickerItemComponent from './PickerItem';
import Overlay from './Overlay';
import type {CusPickerItem} from './types';
import {faker} from '@faker-js/faker';

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
  const data = useInit(() =>
    [...Array(100).keys()].map((index) => createPickerItem(index)),
  );

  return (
    <ExampleWheelPicker
      renderItem={renderItem}
      renderItemContainer={renderItemContainer}
      renderOverlay={renderOverlay}
      style={styles.root}
      data={data}
      width={280}
      itemHeight={60}
    />
  );
};

const styles = StyleSheet.create({
  root: {marginTop: 20},
});

export default memo(CustomizedPicker);
