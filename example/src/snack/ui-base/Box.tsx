import React from 'react';
import {View} from 'react-native';

type BoxProps = {
  height: number;
};

const Box = ({height}: BoxProps) => {
  return <View style={{height}} />;
};

export default Box;
