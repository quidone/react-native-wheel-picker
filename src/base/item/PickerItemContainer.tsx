import React, {memo, type RefObject, useMemo} from 'react';
import {
  Animated,
  StyleProp,
  TextStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import {useScrollContentOffset} from '../contexts/ScrollContentOffsetContext';
import {usePickerItemHeight} from '../contexts/PickerItemHeightContext';
import type {ListMethods, RenderItem} from '../types';
import type {Faces} from './faces';

type PickerItemContainerProps = {
  listRef: RefObject<ListMethods>;
  item: any;
  index: number;
  faces: ReadonlyArray<Faces>;
  renderItem: RenderItem<any>;
  itemTextStyle: StyleProp<TextStyle> | undefined;
  enableScrollByTapOnItem: boolean | undefined;
};

const PickerItemContainer = ({
  listRef,
  index,
  item,
  faces,
  renderItem,
  itemTextStyle,
  enableScrollByTapOnItem,
}: PickerItemContainerProps) => {
  const offset = useScrollContentOffset();
  const height = usePickerItemHeight();

  const {opacity, rotateX, translateY} = useMemo(() => {
    const inputRange = faces.map((f) => height * (index + f.index));
    return {
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
    };
  }, [faces, height, index, offset]);

  const TouchableComponent = enableScrollByTapOnItem
    ? TouchableWithoutFeedback
    : React.Fragment;

  const scrollToItem = () =>
    listRef.current?.scrollToIndex({index, animated: true});

  return (
    <TouchableComponent onPress={scrollToItem}>
      <Animated.View
        style={[
          {
            height,
            opacity,
            transform: [
              {translateY}, // first translateY, then rotateX for correct transformation.
              {rotateX},
              {perspective: 1000}, // without this line this Animation will not render on Android https://reactnative.dev/docs/animations#bear-in-mind
            ],
          },
        ]}
      >
        {renderItem({item, index, itemTextStyle})}
      </Animated.View>
    </TouchableComponent>
  );
};

export default memo(PickerItemContainer);
