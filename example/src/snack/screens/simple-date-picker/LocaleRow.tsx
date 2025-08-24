import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonGroup} from 'react-native-elements';

export const LOCALE_DEFAULT = 'en';
const locales = ['en', 'de', 'ko'];

type LocaleRowProps = {
  selected: string;
  onChange: (locale: string) => void;
};

const LocaleRow = ({selected, onChange}: LocaleRowProps) => {
  return (
    <View style={styles.buttonGroupListItem}>
      <Text style={{fontSize: 16}}>Locale:</Text>
      <ButtonGroup
        buttons={locales}
        selectedIndex={locales.indexOf(selected)}
        onPress={(value) => {
          onChange(locales[value]!);
        }}
        containerStyle={styles.buttonGroupContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default memo(LocaleRow);
