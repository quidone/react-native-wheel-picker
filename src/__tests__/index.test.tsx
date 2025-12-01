import React from 'react';
import renderer from 'react-test-renderer';
import WheelPicker from '@implementation/base';

describe('WheelPicker', () => {
  const basicData = [
    {value: 1, label: 'Item 1'},
    {value: 2, label: 'Item 2'},
    {value: 3, label: 'Item 3'},
  ];

  it('should match snapshot with basic props', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          testID="wheel-picker"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom itemHeight', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          itemHeight={60}
          testID="wheel-picker-custom-height"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom visibleItemCount', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          visibleItemCount={3}
          testID="wheel-picker-custom-visible"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render in readOnly mode', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          readOnly={true}
          testID="wheel-picker-readonly"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom width', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          width={200}
          testID="wheel-picker-custom-width"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should handle onValueChanged callback', () => {
    const onValueChanged = jest.fn();
    const component = renderer.create(
      <WheelPicker
        data={basicData}
        value={1}
        onValueChanged={onValueChanged}
      />,
    );

    // Component should render without errors
    expect(component.toJSON()).toBeTruthy();
  });

  it('should handle onValueChanging callback', () => {
    const onValueChanging = jest.fn();
    const component = renderer.create(
      <WheelPicker
        data={basicData}
        value={1}
        onValueChanging={onValueChanging}
      />,
    );

    // Component should render without errors
    expect(component.toJSON()).toBeTruthy();
  });

  it('should render with custom renderItem', () => {
    const React = require('react');
    const {Text} = require('react-native');
    const customRenderItem = ({item}: {item: {value: number; label?: string}}) =>
      React.createElement(Text, null, item.label || item.value);

    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          renderItem={customRenderItem}
          testID="wheel-picker-custom-render"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with large dataset', () => {
    const largeData = Array.from({length: 100}, (_, i) => ({
      value: i,
      label: `Item ${i}`,
    }));

    const tree = renderer
      .create(
        <WheelPicker
          data={largeData}
          value={50}
          testID="wheel-picker-large-data"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should handle data without labels', () => {
    const dataWithoutLabels = [
      {value: 1},
      {value: 2},
      {value: 3},
    ];

    const tree = renderer
      .create(
        <WheelPicker
          data={dataWithoutLabels}
          value={1}
          testID="wheel-picker-no-labels"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with enableScrollByTapOnItem', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          enableScrollByTapOnItem={true}
          testID="wheel-picker-tap-scroll"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should handle value not found in data (should default to index 0)', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={999}
          testID="wheel-picker-invalid-value"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with empty data array', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={[]}
          value={1}
          testID="wheel-picker-empty-data"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with percentage width', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          width="50%"
          testID="wheel-picker-percentage-width"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with auto width', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          width="auto"
          testID="wheel-picker-auto-width"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with extraValues prop', () => {
    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          extraValues={[1, 2, 3]}
          testID="wheel-picker-extra-values"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with custom keyExtractor', () => {
    const customKeyExtractor = (item: {value: number; label?: string}, index: number) =>
      `custom-${item.value}-${index}`;

    const tree = renderer
      .create(
        <WheelPicker
          data={basicData}
          value={1}
          keyExtractor={customKeyExtractor}
          testID="wheel-picker-custom-key"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with string values', () => {
    const stringData = [
      {value: 'a', label: 'Option A'},
      {value: 'b', label: 'Option B'},
      {value: 'c', label: 'Option C'},
    ];

    const tree = renderer
      .create(
        <WheelPicker
          data={stringData}
          value="b"
          testID="wheel-picker-string-values"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with single item in data', () => {
    const singleItemData = [{value: 1, label: 'Only Item'}];

    const tree = renderer
      .create(
        <WheelPicker
          data={singleItemData}
          value={1}
          testID="wheel-picker-single-item"
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
