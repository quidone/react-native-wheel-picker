import {useCallback, useState} from 'react';
const useBoolean = (defaultValue: boolean) => {
  const [value, setValue] = useState(defaultValue);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return {
    value,
    setTrue,
    setFalse,
  };
};
export default useBoolean;
