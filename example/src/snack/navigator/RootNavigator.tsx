import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SimplePickerScreen} from '../screens/simple-picker';
import {MainScreen} from '../screens/main';
import {SimplePickerAndIOSPickerScreen} from '../screens/simple-picker-and-ios-picker';
import {CustomizedPickerScreen} from '../screens/customized-picker';
import {SimpleDatePickerScreen} from '../screens/simple-date-picker';
import {ControlSimpleUsage} from '../screens/control-simple-usage';

// @ts-ignore
const RootStackNavigator = createNativeStackNavigator({
  screens: {
    Main: MainScreen,
    SimplePicker: SimplePickerScreen,
    SimplePickerAndIOSPicker: SimplePickerAndIOSPickerScreen,
    CustomizedPicker: CustomizedPickerScreen,
    SimpleDatePicker: SimpleDatePickerScreen,
    ControlSimpleUsage: ControlSimpleUsage,
  },
});

export const RootNavigation = createStaticNavigation(RootStackNavigator);
