import WheelPicker from '@implementation/base';
import React from 'react';
import renderer from 'react-test-renderer';

describe('WheelPicker', () => {
  it('should match snapshot', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={[{value: 1, label: 'Item 1'}]}
          testID="wheel-picker"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
