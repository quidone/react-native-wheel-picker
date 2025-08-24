import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import {Alert} from 'react-native';
import {useMemoObject, useStableCallback} from '@rozhkov/react-useful-hooks';
import {useNativeFeedbackModule} from '../native-api-provider';

type PickerConfig = {
  enabledSound: boolean;
  enabledImpact: boolean;
  enabledVirtualized: boolean;
  enableScrollByTapOnItem: boolean;
  readOnly: boolean;
  visibleItemCount: number;
};

type ContextVal = {
  toggleSound: () => void;
  toggleImpact: () => void;
  toggleVirtualized: () => void;
  toggleScrollByTapOnItem: () => void;
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

const PickerPropsChangerProvider = ({children}: PropsWithChildren) => {
  const nativeFeedbackModule = useNativeFeedbackModule();

  const [config, setConfig] = useState<PickerConfig>(() => ({
    enabledSound: false,
    enabledImpact: false,
    enabledVirtualized: false,
    enableScrollByTapOnItem: true,
    readOnly: false,
    visibleItemCount: 5,
  }));
  const toggleSound = useStableCallback(() => {
    if (nativeFeedbackModule === 'NOT_SUPPORT_IN_SNACK') {
      alertNotAvailableFeedback();
      return;
    }
    setConfig((prev) => ({...prev, enabledSound: !prev.enabledSound}));
  });
  const toggleImpact = useStableCallback(() => {
    if (nativeFeedbackModule === 'NOT_SUPPORT_IN_SNACK') {
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
  const toggleScrollByTapOnItem = useStableCallback(() => {
    setConfig((prev) => ({
      ...prev,
      enableScrollByTapOnItem: !prev.enableScrollByTapOnItem,
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
    toggleScrollByTapOnItem,
    toggleReadOnly,
    changeVisibleItemCount,
  });

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default PickerPropsChangerProvider;

export const usePickerPropsChanger = () => {
  const value = useContext(Context);
  if (value === undefined) {
    throw new Error(
      `usePickerPropsChanger must be called from within PickerPropsChangerProvider!`,
    );
  }
  return value;
};
