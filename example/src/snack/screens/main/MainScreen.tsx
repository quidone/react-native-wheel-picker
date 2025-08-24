import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ListItem} from 'react-native-elements';
import {Divider} from '../../ui-base';

const screens: {title: string; screenName: string}[] = [
  {screenName: 'SimplePicker', title: 'Picker'},
  {
    screenName: 'SimplePickerAndIOSPicker',
    title: 'Picker and iOS Picker',
  },
  {
    screenName: 'CustomizedPicker',
    title: 'Customized Picker',
  },
  {
    screenName: 'SimpleDatePicker',
    title: 'Date Picker',
  },
  {
    screenName: 'ControlSimpleUsage',
    title: 'Control / Simple usage',
  },
  {
    screenName: 'WithBottomSheet',
    title: 'Picker with @gorhom/bottom-sheet',
  },
];

const MainScreen = () => {
  const navigation = useNavigation();

  return (
    <>
      {screens.map((screen) => (
        <React.Fragment key={screen.screenName}>
          <ListItem
            onPress={() => {
              // @ts-ignore
              navigation.navigate(screen.screenName);
            }}
          >
            <ListItem.Content>
              <ListItem.Title>{screen.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color={'gray'} />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </>
  );
};

export default MainScreen;
