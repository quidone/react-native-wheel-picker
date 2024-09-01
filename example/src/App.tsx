import * as React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import PickerConfigProvider from './picker-config/PickerConfigProvider';
import SimplePicker from './pickers/SimplePicker';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CompareWithNativeIOS from './pickers/CompareWithNativeIOS';
import PickerConfigPanel from './pickers/PickerConfigPanel';
import CustomizedPicker from './pickers/customized/CustomizedPicker';
import Header from './components/Header';
import Box from './components/Box';
import Button from './components/Button';
import {RenderScrollView} from 'src/base/types';

const App = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView>
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
        <Button onPress={openBottomSheet}>open Gorhom BottomSheet</Button>
        <BottomSheet
          snapPoints={[250]}
          style={styles.bottomSheet}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          index={-1}
        >
          <SimplePicker
            renderScrollView={BottomSheetScrollView as RenderScrollView}
          />
        </BottomSheet>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomSheet: {
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
