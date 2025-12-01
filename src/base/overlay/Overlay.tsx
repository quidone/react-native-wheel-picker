import React, {memo} from 'react';
import {type StyleProp, type ViewStyle, StyleSheet, View} from 'react-native';
type OverlayProps = {
  itemHeight: number;
  pickerWidth: number | 'auto' | `${number}%`;
  overlayItemStyle: StyleProp<ViewStyle> | undefined;
};
const Overlay = ({itemHeight, overlayItemStyle}: OverlayProps) => {
  return (
    <View style={[styles.overlayContainer]} pointerEvents={'none'}>
      <View
        style={[
          styles.selection,
          {
            height: itemHeight,
          },
          overlayItemStyle,
        ]}
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
