import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {
  usePickerItemHeight,
  type RenderItemProps,
} from '@quidone/react-native-wheel-picker';
import type {CusPickerItem} from './types';

const PickerItem = ({
  item: {
    value: {firstName, lastName, job, avatarUrl},
  },
}: RenderItemProps<CusPickerItem>) => {
  const height = usePickerItemHeight();
  return (
    <ListItem style={{height}} containerStyle={styles.container}>
      <Avatar rounded={true} source={{uri: avatarUrl}} />
      <ListItem.Content>
        <ListItem.Title>{`${firstName} ${lastName}`}</ListItem.Title>
        <ListItem.Subtitle>{job}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'transparent'},
});

export default memo(PickerItem);
