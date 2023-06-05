import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

type OverlayProps = {
  itemHeight: number;
  pickerWidth: number | string;
  selectionOverlayStyle: StyleProp<ViewStyle> | undefined;
};

const Overlay = ({itemHeight, selectionOverlayStyle}: OverlayProps) => {
  return (
    <View style={[styles.overlayContainer]} pointerEvents={'none'}>
      <View
        style={[styles.selection, {height: itemHeight}, selectionOverlayStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selection: {
    opacity: 0.05,
    backgroundColor: '#000',
    borderRadius: 8,
    alignSelf: 'stretch',
  },
});

export default memo(Overlay);
