import React, {memo, useState} from 'react';
import Picker from '@quidone/react-native-wheel-picker';
import {Picker as PickerPicker} from '@react-native-picker/picker';
import {StyleSheet, Text, View} from 'react-native';

const items = Array.from({length: 200}).map((_, i) => ({
  value: i,
  label: `${i}`,
}));

const CompareWithPickerPicker = () => {
  const [value, setValue] = useState<number>(10);

  return (
    <View style={styles.root}>
      <View style={styles.itemContainer}>
        <Picker
          onValueChanged={({item}) => {
            setValue(item.value);
          }}
          value={2}
          width={100}
          data={items}
        />
        <Text style={styles.subtitle}>From here</Text>
      </View>
      <View style={styles.itemContainer}>
        <PickerPicker
          selectedValue={value}
          onValueChange={(v) => setValue(v)}
          style={{width: 100, marginTop: 12}}
        >
          {items.map((item) => {
            return (
              <PickerPicker.Item
                key={item.value}
                value={item.value}
                label={item.label}
                style={{fontSize: 20}}
              />
            );
          })}
        </PickerPicker>
        <Text style={styles.subtitle}>react-native-picker/picker</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 300,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  subtitle: {color: 'gray', fontSize: 10},
});

export default memo(CompareWithPickerPicker);
