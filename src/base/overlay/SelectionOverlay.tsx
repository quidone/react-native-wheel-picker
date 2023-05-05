import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type SelectionOverlayProps = {
  height: number;
  width: number | string;
  selectionOverlayStyle?: StyleProp<ViewStyle>;
};

const SelectionOverlay = ({
  height,
  width,
  selectionOverlayStyle,
}: SelectionOverlayProps) => {
  return <View style={[styles.root, {height, width}, selectionOverlayStyle]} />;
};

const styles = StyleSheet.create({
  root: {
    opacity: 0.05,
    backgroundColor: '#000',
    borderRadius: 8,
  },
});

export default memo(SelectionOverlay);
