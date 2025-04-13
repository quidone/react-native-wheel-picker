import {useMemo} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {type DateUnitType, DateUtils} from './date';
import {dateStyles} from './styles';

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
