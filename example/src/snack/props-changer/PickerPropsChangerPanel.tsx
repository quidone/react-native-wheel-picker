import React, {memo} from 'react';
import {
  Linking,
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import {ListItemCheckBox, Divider} from '../ui-base';
import {ButtonGroup} from 'react-native-elements';
import {useInit} from '@rozhkov/react-useful-hooks';
import {usePickerPropsChanger} from './PickerPropsChangerProvider';
import {WP_FEEDBACK_GITHUB_URL} from '../contants';

type PickerPropsChangerPanelProps = {
  style?: StyleProp<ViewStyle>;
  hideSound?: boolean;
  hideImpact?: boolean;
  hideVirtualized?: boolean;
};

const PickerPropsChangerPanel = ({
  style,
  hideImpact,
  hideSound,
  hideVirtualized,
}: PickerPropsChangerPanelProps) => {
  const {
    enabledVirtualized,
    enabledSound,
    enabledImpact,
    readOnly,
    enableScrollByTapOnItem,
    visibleItemCount,
    toggleVirtualized,
    toggleSound,
    toggleImpact,
    toggleReadOnly,
    toggleScrollByTapOnItem,
    changeVisibleItemCount,
  } = usePickerPropsChanger();

  const visibleItemCounts = useInit(() => ['1', '3', '5', '7', '9']);

  return (
    <View style={[styles.root, style]}>
      <Divider />
      {!hideSound && (
        <>
          <ListItemCheckBox
            title={'Sound'}
            value={enabledSound}
            onToggle={toggleSound}
          />
          <Divider />
        </>
      )}
      {!hideImpact && (
        <>
          <ListItemCheckBox
            title={'Impact'}
            value={enabledImpact}
            onToggle={toggleImpact}
          />
          <Divider />
        </>
      )}
      {!hideVirtualized && (
        <>
          <ListItemCheckBox
            title={'Virtualized'}
            value={enabledVirtualized}
            onToggle={toggleVirtualized}
          />
          <Divider />
        </>
      )}
      <ListItemCheckBox
        title={'readOnly'}
        value={readOnly}
        onToggle={toggleReadOnly}
      />
      <Divider />
      <ListItemCheckBox
        title={'enableScrollByTapOnItem'}
        value={enableScrollByTapOnItem}
        onToggle={toggleScrollByTapOnItem}
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
    paddingVertical: 0,
    justifyContent: 'space-between',
  },
  buttonGroupContainer: {
    flex: 1,
    maxWidth: 200,
    marginLeft: 40,
    marginRight: 0,
  },
});

export default memo(PickerPropsChangerPanel);
