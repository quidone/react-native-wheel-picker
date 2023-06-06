import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PickerConfigProvider from './picker-config/PickerConfigProvider';
import SimplePicker from './pickers/SimplePicker';
import CompareWithNativeIOS from './pickers/CompareWithNativeIOS';
import PickerConfigPanel from './pickers/PickerConfigPanel';
import CustomizedPicker from './pickers/customized/CustomizedPicker';
import Header from './components/Header';
import Box from './components/Box';

const App = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Header title={'Simple Picker'} />
      <SimplePicker />
      <PickerConfigPanel />
      <Box height={40} />
      <Header title={'Comparing with Native iOS'} />
      <CompareWithNativeIOS />
      <Box height={100} />
      <Header title={'Customized Picker'} />
      <CustomizedPicker />
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
