import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import {useMemoObject, useStableCallback} from '@rozhkov/react-useful-hooks';

type PickerConfig = {
  enabledSound: boolean;
  enabledImpact: boolean;
  enabledVirtualized: boolean;
};

type ContextVal = {
  toggleSound: () => void;
  toggleImpact: () => void;
  toggleVirtualized: () => void;
} & PickerConfig;

const Context = createContext<ContextVal | undefined>(undefined);

const PickerConfigProvider = ({children}: PropsWithChildren) => {
  const [config, setConfig] = useState<PickerConfig>(() => ({
    enabledSound: false,
    enabledImpact: false,
    enabledVirtualized: false,
  }));
  const toggleSound = useStableCallback(() => {
    setConfig((prev) => ({...prev, enabledSound: !prev.enabledSound}));
  });
  const toggleImpact = useStableCallback(() => {
    setConfig((prev) => ({...prev, enabledImpact: !prev.enabledImpact}));
  });
  const toggleVirtualized = useStableCallback(() => {
    setConfig((prev) => ({
      ...prev,
      enabledVirtualized: !prev.enabledVirtualized,
    }));
  });

  const value = useMemoObject<ContextVal>({
    ...config,
    toggleSound,
    toggleImpact,
    toggleVirtualized,
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
