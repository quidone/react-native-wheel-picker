import React, {memo, useMemo} from 'react';
import {Animated} from 'react-native';
import {useScrollContentOffset} from '../contexts/ScrollContentOffsetContext';
import {usePickerItemHeight} from '../contexts/PickerItemHeightContext';
import type {RenderItem} from '../types';
import type {Faces} from './faces';

type PickerItemContainerProps = {
  item: any;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<any>;
};

const PickerItemContainer = ({
  index,
  item,
  faces,
  renderItem,
}: PickerItemContainerProps) => {
  const offset = useScrollContentOffset();
  const height = usePickerItemHeight();

  const inputRange = useMemo(
    () => faces.map((f) => height * (index + f.index)),
    [faces, height, index],
  );

  const {opacity, rotateX, translateY} = useMemo(
    () => ({
      opacity: offset.interpolate({
        inputRange: inputRange,
        outputRange: faces.map((x) => x.opacity),
        extrapolate: 'clamp',
      }),
      rotateX: offset.interpolate({
        inputRange: inputRange,
        outputRange: faces.map((x) => `${x.deg}deg`),
        extrapolate: 'extend',
      }),
      translateY: offset.interpolate({
        inputRange: inputRange,
        outputRange: faces.map((x) => x.offsetY),
        extrapolate: 'extend',
      }),
    }),
    [faces, inputRange, offset],
  );

  return (
    <Animated.View
      style={[{height, opacity, transform: [{translateY}, {rotateX}]}]}
    >
      {renderItem({item, index})}
    </Animated.View>
  );
};

export default memo(PickerItemContainer);
