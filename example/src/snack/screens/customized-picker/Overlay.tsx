import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import type {RenderOverlayProps} from '@quidone/react-native-wheel-picker';

const Overlay = ({itemHeight, overlayItemStyle}: RenderOverlayProps) => {
  return (
    <View style={[styles.overlayContainer]} pointerEvents={'none'}>
      <View
        style={[styles.selection, {height: itemHeight}, overlayItemStyle]}
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
    borderColor: 'gray',
    borderTopWidth: 0.33,
    borderBottomWidth: 0.33,
    alignSelf: 'stretch',
  },
});

export default memo(Overlay);
