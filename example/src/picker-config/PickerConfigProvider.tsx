import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import {useMemoObject, useStableCallback} from '@rozhkov/react-useful-hooks';
import {IS_EXPO_SNACK} from '../contants';
import {Alert} from 'react-native';

type PickerConfig = {
  enabledSound: boolean;
  enabledImpact: boolean;
  enabledVirtualized: boolean;
  readOnly: boolean;
  visibleItemCount: number;
};

type ContextVal = {
  toggleSound: () => void;
  toggleImpact: () => void;
  toggleVirtualized: () => void;
  toggleReadOnly: () => void;
  changeVisibleItemCount: (count: number) => void;
} & PickerConfig;

const Context = createContext<ContextVal | undefined>(undefined);

const alertNotAvailableFeedback = () => {
  Alert.alert(
    'Feedback is not available in the Snack',
    'You need to go to the @quidone/react-native-wheel-picker repository' +
      ' and build the example project using the "npx expo run:ios" console command.',
  );
};

const PickerConfigProvider = ({children}: PropsWithChildren) => {
  const [config, setConfig] = useState<PickerConfig>(() => ({
    enabledSound: false,
    enabledImpact: false,
    enabledVirtualized: false,
    readOnly: false,
    visibleItemCount: 5,
  }));
  const toggleSound = useStableCallback(() => {
    if (IS_EXPO_SNACK) {
      alertNotAvailableFeedback();
      return;
    }
    setConfig((prev) => ({...prev, enabledSound: !prev.enabledSound}));
  });
  const toggleImpact = useStableCallback(() => {
    if (IS_EXPO_SNACK) {
      alertNotAvailableFeedback();
      return;
    }
    setConfig((prev) => ({...prev, enabledImpact: !prev.enabledImpact}));
  });
  const toggleVirtualized = useStableCallback(() => {
    setConfig((prev) => ({
      ...prev,
      enabledVirtualized: !prev.enabledVirtualized,
    }));
  });
  const toggleReadOnly = useStableCallback(() => {
    setConfig((prev) => ({
      ...prev,
      readOnly: !prev.readOnly,
    }));
  });
  const changeVisibleItemCount = useStableCallback(
    (count: 1 | 3 | 5 | 7 | 9 | number) => {
      setConfig((prev) => ({
        ...prev,
        visibleItemCount: count,
      }));
    },
  );

  const value = useMemoObject<ContextVal>({
    ...config,
    toggleSound,
    toggleImpact,
    toggleVirtualized,
    toggleReadOnly,
    changeVisibleItemCount,
  });

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PickerConfigProvider;

export const usePickerConfig = () => {
  const value = useContext(Context);
  if (value === undefined) {
    throw new Error(
      `usePickerConfig must be called from within PickerConfigProvider!`,
    );
  }
  return value;
};
