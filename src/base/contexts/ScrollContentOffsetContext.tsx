import {createContext, useContext} from 'react';
import type {SharedValue} from 'react-native-reanimated';

type ContextValue = SharedValue<number>;

export const ScrollContentOffsetContext = createContext<
  ContextValue | undefined
>(undefined);

export const useScrollContentOffset = () => {
  const value = useContext(ScrollContentOffsetContext);
  if (value === undefined) {
    throw new Error(
      'useScrollContentOffset must be called from within ScrollContentOffsetContext.Provider!',
    );
  }
  return value;
};
