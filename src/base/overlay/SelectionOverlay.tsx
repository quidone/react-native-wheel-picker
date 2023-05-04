import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

type SelectionOverlayProps = {
  height: number;
  width: number | string;
};

const SelectionOverlay = ({height, width}: SelectionOverlayProps) => {
  return <View style={[styles.root, {height, width}]} />;
};

const styles = StyleSheet.create({
  root: {
    opacity: 0.05,
    backgroundColor: '#000',
    borderRadius: 8,
  },
});

export default memo(SelectionOverlay);
