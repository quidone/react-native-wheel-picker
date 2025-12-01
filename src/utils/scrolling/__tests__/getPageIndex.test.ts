import {getPageIndex as getPageIndexOriginal} from '../getPageIndex';
const PAGE_LENGTH = 10;
const MAX_INDEX = 2;
const getPageIndex = (offset: number) =>
  getPageIndexOriginal(offset, {
    pageLength: PAGE_LENGTH,
    maxIndex: MAX_INDEX,
  });
describe('getPageIndex', () => {
  test('Should return correct page index', () => {
    expect(getPageIndex(-100)).toEqual(0);
    expect(getPageIndex(0)).toEqual(0);
    expect(getPageIndex(4.99)).toEqual(0);
    expect(getPageIndex(5)).toEqual(1);
    expect(getPageIndex(10)).toEqual(1);
    expect(getPageIndex(14.99)).toEqual(1);
    expect(getPageIndex(15)).toEqual(2);
    expect(getPageIndex(20)).toEqual(2);
    expect(getPageIndex(100)).toEqual(2);
  });
});
