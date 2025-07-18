import * as React from 'react';
import WheelPickerFeedback from '@quidone/react-native-wheel-picker-feedback';
import {NativeFeedbackProvider, RootNavigation} from './snack';

const App = () => {
  return (
    <NativeFeedbackProvider module={WheelPickerFeedback}>
      <RootNavigation />
    </NativeFeedbackProvider>
  );
};

export default App;
