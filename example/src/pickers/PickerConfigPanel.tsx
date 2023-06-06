import React, {memo} from 'react';
import ListItemCheckBox from '../components/ListItemCheckBox';
import Divider from '../components/Divider';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {usePickerConfig} from '../picker-config/PickerConfigProvider';
import {WP_FEEDBACK_GITHUB_URL} from '../contants';

const PickerConfigPanel = () => {
  const {
    enabledVirtualized,
    enabledSound,
    enabledImpact,
    toggleVirtualized,
    toggleSound,
    toggleImpact,
  } = usePickerConfig();

  return (
    <View style={styles.root}>
      <Divider />
      <ListItemCheckBox
        title={'Sound'}
        value={enabledSound}
        onToggle={toggleSound}
      />
      <Divider />
      <ListItemCheckBox
        title={'Impact'}
        value={enabledImpact}
        onToggle={toggleImpact}
      />
      <Divider />
      <ListItemCheckBox
        title={'Virtualized'}
        value={enabledVirtualized}
        onToggle={toggleVirtualized}
      />
      <Divider />
      <TouchableOpacity
        style={{paddingVertical: 12}}
        onPress={() => {
          Linking.openURL(WP_FEEDBACK_GITHUB_URL);
        }}
      >
        <Text style={styles.subtitle}>Sound and impact only work on iOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {paddingVertical: 12, alignSelf: 'stretch'},
  subtitle: {
    color: 'gray',
    fontSize: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default memo(PickerConfigPanel);
