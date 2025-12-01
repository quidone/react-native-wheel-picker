/**
 * React Native Wheel Picker Example
 *
 * @format
 */

import * as React from 'react';
import {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';

const data = Array.from({length: 100}, (_, index) => ({
  value: index,
  label: `Item ${index}`,
}));

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [value, setValue] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <Text style={styles.title}>Wheel Picker Example</Text>
        <Text style={styles.subtitle}>Selected: {value}</Text>
        <View style={styles.pickerContainer}>
          <WheelPicker
            data={data}
            value={value}
            onValueChanged={({item: {value: newValue}}) => setValue(newValue)}
            enableScrollByTapOnItem={true}
            testID="wheel-picker"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#666',
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 300,
    height: 200,
  },
});

export default App;
