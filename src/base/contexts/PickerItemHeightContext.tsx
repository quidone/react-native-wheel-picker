import {createContext, useContext} from 'react';
type ContextValue = number;
export const PickerItemHeightContext = createContext<ContextValue | undefined>(
  undefined,
);
export const usePickerItemHeight = () => {
  const value = useContext(PickerItemHeightContext);
  if (value === undefined) {
    throw new Error(
      'usePickerItemHeight must be called from within PickerItemHeightContext.Provider!',
    );
  }
  return value;
};
