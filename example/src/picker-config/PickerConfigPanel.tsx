import React, {memo} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ListItemCheckBox, Divider} from '../components/base';
import {usePickerConfig} from './PickerConfigProvider';
import {WP_FEEDBACK_GITHUB_URL} from '../contants';
import {ButtonGroup} from 'react-native-elements';
import {useInit} from '@rozhkov/react-useful-hooks';

const PickerConfigPanel = () => {
  const {
    enabledVirtualized,
    enabledSound,
    enabledImpact,
    visibleItemCount,
    toggleVirtualized,
    toggleSound,
    toggleImpact,
    changeVisibleItemCount,
  } = usePickerConfig();

  const visibleItemCounts = useInit(() => ['1', '3', '5', '7', '9']);

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
      <View style={styles.buttonGroupListItem}>
        <Text style={{fontSize: 16}}>Visible Count:</Text>
        <ButtonGroup
          buttons={visibleItemCounts}
          selectedIndex={visibleItemCounts.indexOf(`${visibleItemCount}`)}
          onPress={(value) => {
            changeVisibleItemCount(parseInt(visibleItemCounts[value]!));
          }}
          containerStyle={styles.buttonGroupContainer}
        />
      </View>
      <Divider />
      <TouchableOpacity
        style={styles.touchable}
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
  touchable: {paddingVertical: 12},
  buttonGroupListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  buttonGroupContainer: {
    flex: 1,
    maxWidth: 200,
    marginLeft: 40,
    marginRight: 0,
  },
});

export default memo(PickerConfigPanel);
