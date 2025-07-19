import React from 'react';
import {View, type ViewProps} from 'react-native';

const PickerScreenViewContainer = ({style, ...restProps}: ViewProps) => {
  return (
    <View
      {...restProps}
      style={[
        {
          flex: 1,
          paddingHorizontal: 16,
          paddingBottom: 32,
          justifyContent: 'flex-end',
        },
        style,
      ]}
    />
  );
};

export default PickerScreenViewContainer;
