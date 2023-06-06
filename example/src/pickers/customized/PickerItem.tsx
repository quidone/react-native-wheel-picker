import type {RenderItemProps} from '@quidone/react-native-wheel-picker';
import {usePickerItemHeight} from '@quidone/react-native-wheel-picker';
import React, {memo} from 'react';
import {Avatar, ListItem} from 'react-native-elements';
import type {CusPickerItem} from './types';

const PickerItem = ({
  item: {
    value: {firstName, lastName, job, avatarUrl},
  },
}: RenderItemProps<CusPickerItem>) => {
  const height = usePickerItemHeight();
  return (
    <ListItem
      style={{height}}
      containerStyle={{backgroundColor: 'transparent'}}
    >
      <Avatar rounded={true} source={{uri: avatarUrl}} />
      <ListItem.Content>
        <ListItem.Title>{`${firstName} ${lastName}`}</ListItem.Title>
        <ListItem.Subtitle>{job}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default memo(PickerItem);
