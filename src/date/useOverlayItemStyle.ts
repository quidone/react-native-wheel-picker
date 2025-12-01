import {useMemo} from 'react';
import {type StyleProp, StyleSheet, type ViewStyle} from 'react-native';
import {type DateUnitType, DateUtils} from './date';
export const useOverlayItemStyle = ({
  curUnit,
  unitPositions,
  propStyle,
}: {
  unitPositions: DateUnitType[];
  curUnit: DateUnitType;
  propStyle: StyleProp<ViewStyle>;
}) => {
  return useMemo(() => {
    if (DateUtils.isFirstUnitPosition(unitPositions, curUnit)) {
      return [dateStyles.leftItemOverlay, propStyle];
    } else if (DateUtils.isLastUnitPosition(unitPositions, curUnit)) {
      return [dateStyles.rightItemOverlay, propStyle];
    } else {
      return [dateStyles.zeroBorderRadius, propStyle];
    }
  }, [curUnit, propStyle, unitPositions]);
};
export const dateStyles = StyleSheet.create({
  leftItemOverlay: {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  rightItemOverlay: {
    borderRadius: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  zeroBorderRadius: {
    borderRadius: 0,
  },
});
