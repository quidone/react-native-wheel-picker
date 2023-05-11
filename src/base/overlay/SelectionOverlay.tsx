import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type SelectionOverlayProps = {
  height: number;
  selectionOverlayStyle?: StyleProp<ViewStyle>;
};

const SelectionOverlay = ({
  height,
  selectionOverlayStyle,
}: SelectionOverlayProps) => {
  return <View style={[styles.root, {height}, selectionOverlayStyle]} />;
};

const styles = StyleSheet.create({
  root: {
    opacity: 0.05,
    backgroundColor: '#000',
    borderRadius: 8,
    alignSelf: 'stretch',
  },
});

export default memo(SelectionOverlay);
