export const degToRad = (deg: number) => (Math.PI * deg) / 180;
export const sum = (nums: ReadonlyArray<number>) =>
  nums.reduce((r, v) => r + v, 0);
