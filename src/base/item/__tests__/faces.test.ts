import {createFaces} from '../faces';
const FACE_HEIGHT = 48;
describe('createFaces', () => {
  const visibleItemCounts = [1, 3, 5, 7];
  visibleItemCounts.forEach((count) => {
    test(`Matches snapshot for visible item count of ${count}.`, () => {
      expect(createFaces(FACE_HEIGHT, count)).toMatchSnapshot();
    });
  });
});
