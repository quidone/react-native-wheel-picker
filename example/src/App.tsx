import * as React from 'react';
import WheelPickerFeedback from '@quidone/react-native-wheel-picker-feedback';
import {NativeFeedbackProvider, RootNavigation} from './snack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <NativeFeedbackProvider module={WheelPickerFeedback}>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <RootNavigation />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </NativeFeedbackProvider>
  );
};

export default App;
