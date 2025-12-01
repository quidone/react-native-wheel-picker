export const getPageIndex = (
  offset: number,
  {
    maxIndex,
    pageLength,
  }: {
    maxIndex: number;
    pageLength: number;
  },
) => {
  let index = Math.floor((offset + pageLength / 2) / pageLength);
  index = Math.max(0, index);
  index = Math.min(index, maxIndex);
  return index;
};
