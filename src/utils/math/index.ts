export const TRIANGLE_ANGLE_SUM = 180;

export const degToRad = (deg: number) => (Math.PI * deg) / 180;
export const sum = (nums: ReadonlyArray<number>) =>
  nums.reduce((r, v) => r + v, 0);
export const sumAnglePolygon = (faceCount: number) =>
  TRIANGLE_ANGLE_SUM * (faceCount - 2);
