import React, {type FC, memo, useCallback, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {useInit} from '@rozhkov/react-useful-hooks';
import {Picker as IOSPicker} from '@react-native-picker/picker';
import Picker, {
  type OnValueChanged,
  type PickerItem,
} from '@quidone/react-native-wheel-picker';
import {Divider, PickerScreenViewContainer} from '../../ui-base';
import {
  PickerPropsChangerPanel,
  PickerPropsChangerProvider,
  withPropsChanger,
} from '../../props-changer';

let WheelPickers: FC;

if (Platform.OS === 'ios') {
  const ExamplePicker = withPropsChanger(Picker);
  const createPickerItem = (index: number): PickerItem<number> => ({
    value: index,
    label: index.toString(),
  });

  WheelPickers = memo(() => {
    const items = useInit(() => [...Array(100).keys()].map(createPickerItem));
    const [value, setValue] = useState<number>(0);
    const onValueChangedEx = useCallback<OnValueChanged<PickerItem<number>>>(
      ({item}) => {
        setValue(item.value);
      },
      [],
    );
    const onValueChangeIOS = useCallback((itemValue: number) => {
      // itemValue is a magic number: 1 (is itemValue) === 1 return false;
      // parseInt helps to fix this
      setValue(parseInt(itemValue as any));
    }, []);

    return (
      <View style={styles.root}>
        <View style={styles.itemContainer}>
          <ExamplePicker
            onValueChanged={onValueChangedEx}
            value={value}
            width={100}
            data={items}
            enableScrollByTapOnItem={true}
          />
          <Text style={styles.subtitle}>WheelPicker</Text>
        </View>
        <View style={styles.itemContainer}>
          <IOSPicker
            selectedValue={value}
            onValueChange={onValueChangeIOS}
            style={styles.iosPicker}
          >
            {items.map((item) => {
              return (
                <IOSPicker.Item
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  style={styles.iosPickerItem}
                />
              );
            })}
          </IOSPicker>
          <Text style={styles.subtitle}>Native iOS</Text>
        </View>
      </View>
    );
  });

  const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingVertical: 20,
      minHeight: 240,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 10,
    },
    subtitle: {color: 'gray', fontSize: 10, padding: 16},
    iosPicker: {width: 120, marginTop: 12},
    iosPickerItem: {fontSize: 20},
  });
} else {
  WheelPickers = memo(() => {
    return (
      <Text style={styles.root}>
        To compare with iOS native wheel picker, run the example on an emulator
        or a real device on the iOS operating system
      </Text>
    );
  });
  const styles = StyleSheet.create({root: {textAlign: 'center', padding: 20}});
}

const SimplePickerAndIOSPickerScreen = () => {
  return (
    <PickerPropsChangerProvider>
      <PickerScreenViewContainer>
        <Divider />
        <View style={{alignItems: 'center'}}>
          <WheelPickers />
        </View>
        <PickerPropsChangerPanel />
      </PickerScreenViewContainer>
    </PickerPropsChangerProvider>
  );
};

export default SimplePickerAndIOSPickerScreen;
