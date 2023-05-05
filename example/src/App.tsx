import * as React from 'react';

import {StyleSheet, View} from 'react-native';
import CompareWithPickerPicker from './CompareWithPickerPicker';

export default function App() {
  return (
    <View style={styles.container}>
      <CompareWithPickerPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
