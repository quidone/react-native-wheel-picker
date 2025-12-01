import {useEffect} from 'react';
import {usePrevious, useStableCallback} from '@rozhkov/react-useful-hooks';
const areArraysShallowEqual = (
  arr1: unknown[] | undefined,
  arr2: unknown[] | undefined,
): boolean => {
  if (arr1 === arr2) return true;
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
const useEffectWithDynamicDepsLength = (
  callback: () => void,
  deps: unknown[],
) => {
  const prevDeps = usePrevious(deps);
  const callbackStable = useStableCallback(callback);
  useEffect(() => {
    if (!areArraysShallowEqual(prevDeps, deps)) {
      callbackStable();
    }
  }, [deps]); // eslint-disable-line react-hooks/exhaustive-deps
};
export default useEffectWithDynamicDepsLength;
