import {Animated} from 'react-native';
import React, {memo, useMemo} from 'react';
import {
  PickerItem,
  RenderItemContainerProps,
  usePickerItemHeight,
  useScrollContentOffset,
} from '@quidone/react-native-wheel-picker';

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

  const {opacity, translateY, translateX} = useMemo(
    () => ({
      opacity: offset.interpolate({
        inputRange: inputRange,
        outputRange: faces.map((x) => x.opacity),
        extrapolate: 'clamp',
      }),
      translateY: offset.interpolate({
        inputRange: inputRange,
        outputRange: faces.map((x) => x.offsetY),
        extrapolate: 'extend',
      }),
      translateX: offset.interpolate({
        inputRange: [
          height * (index - 1),
          height * index,
          height * (index + 1),
        ],
        outputRange: [-10, 0, -10],
        extrapolate: 'extend',
      }),
    }),
    [faces, height, index, inputRange, offset],
  );

  return (
    <Animated.View
      style={[{height, opacity, transform: [{translateY}, {translateX}]}]}
    >
      {renderItem({item, index, itemTextStyle})}
    </Animated.View>
  );
};

export default memo(PickerItemContainer);
