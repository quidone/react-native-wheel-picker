import React, {createContext, type PropsWithChildren, useContext} from 'react';

const NativeFeedbackModuleContext = createContext<
  NativeFeedbackModule | 'NOT_SUPPORT_IN_SNACK'
>('NOT_SUPPORT_IN_SNACK');

type NativeFeedbackModule = {
  triggerImpact: () => void;
  triggerSound: () => void;
  triggerSoundAndImpact: () => void;
};

type NativeFeedbackProviderProps = PropsWithChildren<{
  module: NativeFeedbackModule | 'NOT_SUPPORT_IN_SNACK';
}>;

const NativeFeedbackProvider = ({
  module,
  children,
}: NativeFeedbackProviderProps) => {
  return (
    <NativeFeedbackModuleContext.Provider value={module}>
      {children}
    </NativeFeedbackModuleContext.Provider>
  );
};

export default NativeFeedbackProvider;

export const useNativeFeedbackModule = () => {
  const value = useContext(NativeFeedbackModuleContext);
  if (value === undefined) {
    throw new Error(
      'useNativeFeedbackModule must be called from within NativeFeedbackProvider!',
    );
  }
  return useContext(NativeFeedbackModuleContext)!;
};
