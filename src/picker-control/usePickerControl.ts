import {useEffect} from 'react';
import {useInit, useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  type BaseControlConfig,
  type Control,
  type ControlEvents,
  createControl,
} from './create-control';
export const usePickerControl = <
  Config extends BaseControlConfig = BaseControlConfig,
>() => {
  return useInit(() => createControl<Config>());
};
export const useOnPickerValueChangedEffect = <ControlT extends Control>(
  control: ControlT,
  effect: ControlEvents<ControlT>['onValueChanged'],
) => {
  const effectStable = useStableCallback(effect);
  useEffect(() => {
    const unsubscribe = control._on(
      'onValueChanged',
      effectStable as ControlEvents['onValueChanged'],
    );
    return () => {
      unsubscribe();
    };
  }, [control]); // eslint-disable-line react-hooks/exhaustive-deps
};
export const useOnPickerValueChangingEffect = <ControlT extends Control>(
  control: ControlT,
  effect: ControlEvents<ControlT>['onValueChanging'],
) => {
  const effectStable = useStableCallback(effect);
  useEffect(() => {
    const unsubscribe = control._on(
      'onValueChanging',
      effectStable as ControlEvents['onValueChanged'],
    );
    return () => {
      unsubscribe();
    };
  }, [control]); // eslint-disable-line react-hooks/exhaustive-deps
};
