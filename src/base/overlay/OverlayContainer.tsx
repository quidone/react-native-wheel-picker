import React, {memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import type {RenderSelectionOverlay} from '../types';

type OverlayContainerProps = {
  itemHeight: number;
  pickerWidth: number | string;
  renderSelectionOverlay: RenderSelectionOverlay | null | undefined;
  selectionOverlayStyle: StyleProp<ViewStyle> | undefined;
};

const OverlayContainer = ({
  pickerWidth,
  itemHeight,
  renderSelectionOverlay,
  selectionOverlayStyle,
}: OverlayContainerProps) => {
  return (
    <View style={[styles.overlayContainer]} pointerEvents={'none'}>
      {renderSelectionOverlay != null &&
        renderSelectionOverlay?.({
          pickerWidth,
          itemHeight,
          selectionOverlayStyle,
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(OverlayContainer);
