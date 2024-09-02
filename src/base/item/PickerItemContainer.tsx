import React, {memo, useMemo} from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Animated, {useAnimatedStyle, interpolate} from 'react-native-reanimated';
import {useScrollContentOffset} from '../contexts/ScrollContentOffsetContext';
import {usePickerItemHeight} from '../contexts/PickerItemHeightContext';
import type {RenderItem} from '../types';
import type {Faces} from './faces';

type PickerItemContainerProps = {
  item: any;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<any>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
};

const PickerItemContainer = ({
  index,
  item,
  faces,
  renderItem,
  itemTextStyle,
}: PickerItemContainerProps) => {
  const offset = useScrollContentOffset();
  const height = usePickerItemHeight();

  const inputRange = useMemo(
    () => faces.map((f) => height * (index + f.index)),
    [faces, height, index],
  );
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      offset.value,
      inputRange,
      faces.map((x) => x.opacity),
      'clamp',
    );
    const rotateX = `${interpolate(
      offset.value,
      inputRange,
      faces.map((x) => x.deg),
      'extend',
    )}deg`;
    const translateY = interpolate(
      offset.value,
      inputRange,
      faces.map((x) => x.offsetY),
      'extend',
    );
    return {
      opacity,
      transform: [{translateY}, {rotateX}],
    };
  }, [faces, inputRange, offset]);
  return (
    <Animated.View style={[{height}, animatedStyle]}>
      {renderItem({item, index, itemTextStyle})}
    </Animated.View>
  );
};

export default memo(PickerItemContainer);
