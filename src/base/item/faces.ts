import {degToRad, sum, sumAnglePolygon, TRIANGLE_ANGLE_SUM} from '@utils/math';

export type Faces = {
  index: number;
  deg: number;
  offsetY: number;
  opacity: number;
};

const FACE_COUNT = 12;
const VISIBLE_FACE_COUNT = Math.round(FACE_COUNT / 2) + 1; // 7
const VISIBLE_FACE_CENTER = Math.round(VISIBLE_FACE_COUNT / 2); // 4
const OPACITIES = [0.35, 0.2, 0]; // HARD CODE!!!

export const createFaces = (itemHeight: number): Faces[] => {
  const innerAngle = sumAnglePolygon(FACE_COUNT) / FACE_COUNT;
  // the step of deviation of the sides of the screen from the center
  const stepAngle = TRIANGLE_ANGLE_SUM - innerAngle;
  const centerItemHalfHeight = itemHeight / 2;
  const opacities: number[] = OPACITIES;
  const degrees: number[] = [];
  const screenFaceHeights: number[] = [];
  const offsets: number[] = [];

  // We find the values from the center to the top
  for (let i = 1; i < VISIBLE_FACE_CENTER; ++i) {
    const degree = i * stepAngle;
    const screenFaceHeight = Math.round(
      itemHeight * Math.cos(degToRad(degree)),
    );
    const originalOffsetFromCenter = itemHeight * i * -1;
    const needOffsetFromCenter =
      (centerItemHalfHeight + sum(screenFaceHeights) + screenFaceHeight / 2) *
      -1;
    const offset = originalOffsetFromCenter - needOffsetFromCenter;
    degrees.push(degree);
    screenFaceHeights.push(screenFaceHeight);
    offsets.push(offset);
  }

  const result: Faces[] = [];
  // top
  for (let index = 2; index >= 0; --index) {
    const deg = degrees[index]!;
    const opacity = opacities[index] ?? 0;
    const translateY = offsets[index]!;
    result.push({index: index * -1 - 1, deg, opacity, offsetY: translateY});
  }
  // middle
  result.push({
    index: 0,
    deg: 0,
    opacity: 1,
    offsetY: 0,
  });
  // bottom
  for (let index = 0; index < VISIBLE_FACE_CENTER - 1; ++index) {
    const deg = degrees[index]! * -1;
    const opacity = opacities[index] ?? 0;
    const translateY = offsets[index]! * -1;
    result.push({index: index + 1, deg, opacity, offsetY: translateY});
  }
  return result;
};
