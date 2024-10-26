import React, {memo, useMemo} from 'react';
import {
  PickerItem,
  RenderItemContainerProps,
  usePickerItemHeight,
  useScrollContentOffset,
} from '@quidone/react-native-wheel-picker';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

const PickerItemContainer = ({
  index,
  item,
  faces,
  renderItem,
  itemTextStyle,
}: RenderItemContainerProps<PickerItem<any>>) => {
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

    const translateY = interpolate(
      offset.value,
      inputRange,
      faces.map((x) => x.offsetY),
      'extend',
    );

    const translateX = interpolate(
      offset.value,
      [height * (index - 1), height * index, height * (index + 1)],
      [-10, 0, -10],
      'extend',
    );

    return {
      opacity,
      transform: [{translateY}, {translateX}],
    };
  }, [faces, height, index, inputRange, offset]);

  return (
    <Animated.View style={[{height}, animatedStyle]}>
      {renderItem({item, index, itemTextStyle})}
    </Animated.View>
  );
};

export default memo(PickerItemContainer);
