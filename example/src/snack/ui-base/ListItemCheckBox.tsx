import React, {memo} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

type ListItemCheckBoxProps = {
  title: string;
  value: boolean;
  onToggle: () => void;
};

const ListItemCheckBox = ({title, value, onToggle}: ListItemCheckBoxProps) => {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flexDirection: 'row', alignItems: 'center', paddingVertical: 4},
  title: {flex: 1, fontSize: 16},
});

export default memo(ListItemCheckBox);
