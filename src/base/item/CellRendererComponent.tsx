import React, {ReactNode, useMemo} from 'react';
import type {LayoutChangeEvent, StyleProp, ViewStyle} from 'react-native';
import {Animated} from 'react-native';
import {useScrollContentOffset} from '../contexts/ScrollContentOffsetContext';
import {usePickerItemHeight} from '../contexts/PickerItemHeightContext';
import {degToRad} from '../../utils/math';

type PolygonFace = {
  index: number;
  height: number;
  deg: number;
  opacity: number;
  translateY: number;
};

const FACE_COUNT = 12;
const VISIBLE_FACE_COUNT = Math.round(FACE_COUNT / 2) + 1; // 7
const VISIBLE_FACE_CENTER = Math.round(VISIBLE_FACE_COUNT / 2); // 4
const OPACITIES = [0.35, 0.2, 0]; // HARD CODE!!!
const TRIANGLE_ANGLE_SUM = 180;

const sum = (nums: ReadonlyArray<number>) => nums.reduce((r, v) => r + v, 0);
const sumAnglePolygon = (faceCount: number) =>
  TRIANGLE_ANGLE_SUM * (faceCount - 2);

const createFaces = (itemHeight: number) => {
  const innerAngle = sumAnglePolygon(FACE_COUNT) / FACE_COUNT;
  // the step of deviation of the sides of the screen from the center
  const stepAngle = TRIANGLE_ANGLE_SUM - innerAngle;
  const opacities: number[] = OPACITIES;
  const degrees: number[] = [];
  const screenFaceHeights: number[] = [];
  const offsets: number[] = [];

  for (let i = 1; i < VISIBLE_FACE_CENTER; ++i) {
    const degree = i * stepAngle;
    const faceHeight = Math.round(itemHeight * Math.cos(degToRad(degree)));
    const originalOffsetFromCenter = itemHeight * i * -1;
    const needOffsetFromCenter =
      (itemHeight / 2 + sum(screenFaceHeights) + faceHeight / 2) * -1;
    const offset = originalOffsetFromCenter - needOffsetFromCenter;
    degrees.push(degree);
    screenFaceHeights.push(faceHeight);
    offsets.push(offset);
  }

  const result: PolygonFace[] = [];
  // top
  for (let index = 2; index >= 0; --index) {
    const height = screenFaceHeights[index]!;
    const deg = degrees[index]!;
    const opacity = opacities[index] ?? 0;
    const translateY = offsets[index]!;
    result.push({index: index * -1 - 1, height, deg, opacity, translateY});
  }
  // middle
  result.push({index: 0, height: 48, deg: 0, opacity: 1, translateY: 0});
  // bottom
  for (let index = 0; index < VISIBLE_FACE_CENTER - 1; ++index) {
    const height = screenFaceHeights[index]!;
    const deg = degrees[index]! * -1;
    const opacity = opacities[index] ?? 0;
    const translateY = offsets[index]! * -1;
    result.push({index: index + 1, height, deg, opacity, translateY});
  }
  return result;
};

type CellRendererComponentProps = {
  style: StyleProp<ViewStyle>;
  index: number;
  onLayout: (event: LayoutChangeEvent) => void;
  onFocusCapture: (...args: any[]) => any;
  children: ReactNode;
} & Record<string, any>;

export const createCellRendererComponent = (itemHeight: number) => {
  const faces = createFaces(itemHeight);

  const CellRendererComponent = ({
    index,
    style,
    onFocusCapture,
    onLayout,
    children,
  }: CellRendererComponentProps) => {
    const offset = useScrollContentOffset();
    const height = usePickerItemHeight();

    const inputRange = useMemo(
      () => [
        height * (index - 3),
        height * (index - 2),
        height * (index - 1),
        height * index,
        height * (index + 1),
        height * (index + 2),
        height * (index + 3),
      ],
      [height, index],
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
          outputRange: faces.map((x) => x.translateY),
          extrapolate: 'extend',
        }),
      }),
      [inputRange, offset],
    );

    return (
      <Animated.View
        style={[style, {height, opacity, transform: [{translateY}, {rotateX}]}]}
        onLayout={onLayout}
        // @ts-ignore
        onFocusCapture={onFocusCapture}
      >
        {children}
      </Animated.View>
    );
  };

  return CellRendererComponent;
};
