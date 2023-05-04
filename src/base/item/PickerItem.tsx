import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {usePickerItemHeight} from '../contexts/PickerItemHeightContext';

type PickerItemProps = {
  value: any;
  label?: string;
};

const PickerItem = ({value, label}: PickerItemProps) => {
  const height = usePickerItemHeight();

  return (
    <Text style={[styles.root, {lineHeight: height}]}>{label ?? value}</Text>
  );
};

const styles = StyleSheet.create({
  root: {
    textAlign: 'center',
    fontSize: 20,
    // textAlignVertical: 'center',
    // borderColor: 'blue',
    // borderWidth: 1,
  },
});

export default memo(PickerItem);
