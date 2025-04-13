import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {PickerConfigProvider} from './picker-config';
import {Box} from './components/base';
import {
  AvatarCustomizedPickerBlockExample,
  CompareWithNativeIOSBlockExample,
  SimplePickerBlockExample,
} from './components/example-blocks';
import DatePickerExample from './components/example-blocks/DatePickerExample';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <DatePickerExample />
      <SimplePickerBlockExample />
      <AvatarCustomizedPickerBlockExample />
      <CompareWithNativeIOSBlockExample />
      <Box height={100} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

const Providers = () => {
  return (
    <PickerConfigProvider>
      <App />
    </PickerConfigProvider>
  );
};

export default Providers;
