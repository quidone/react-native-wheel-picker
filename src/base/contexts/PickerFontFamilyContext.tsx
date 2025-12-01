import {createContext, useContext} from 'react';

type ContextValue = string | undefined;

export const PickerFontFamilyContext = createContext<ContextValue | undefined>(
  undefined,
);

export const usePickerFontFamily = () => {
  return useContext(PickerFontFamilyContext);
};
