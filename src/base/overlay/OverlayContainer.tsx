import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import type {RenderSelectionOverlay} from '../types';

type OverlayContainerProps = {
  itemHeight: number;
  pickerWidth: number | string;
  renderSelectionOverlay: RenderSelectionOverlay | null | undefined;
};

const OverlayContainer = ({
  pickerWidth,
  itemHeight,
  renderSelectionOverlay,
}: OverlayContainerProps) => {
  return (
    <View style={[styles.overlayContainer]} pointerEvents={'none'}>
      {renderSelectionOverlay != null &&
        renderSelectionOverlay?.({pickerWidth, itemHeight})}
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
});

export default memo(OverlayContainer);
