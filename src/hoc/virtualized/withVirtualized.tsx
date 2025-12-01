import React from 'react';
import type {PickerProps, RenderList} from '../../base';
import Picker, {type PickerItem} from '../../base';
import type {AdditionalProps} from './VirtualizedList';
import VirtualizedList from './VirtualizedList';
export type WithVirtualizedProps<ItemT extends PickerItem<any>> =
  AdditionalProps & PickerProps<ItemT>;
type WithVirtualizedComponent = <ItemT extends PickerItem<any>>(
  props: WithVirtualizedProps<ItemT>,
) => React.ReactElement;
const renderList: RenderList<any> = (props) => {
  return <VirtualizedList {...props} />;
};
const withVirtualized = (
  WrappedComponent: typeof Picker,
): WithVirtualizedComponent => {
  const Wrapper = <ItemT extends PickerItem<any>>(
    props: WithVirtualizedProps<ItemT>,
  ) => {
    return <Picker {...props} renderList={renderList} />;
  };

  // @ts-ignore
  Wrapper.displayName = `withVirtualized(${WrappedComponent.displayName})`;
  return Wrapper;
};
export default withVirtualized;
