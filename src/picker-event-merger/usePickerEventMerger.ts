import {useCallback, useRef} from 'react';
import type {ValueChangedEvent, ValueChangingEvent} from '@implementation/base';

type SubId = string;
let nextSubId = 1;
const getNewSubId = (): SubId => `${++nextSubId}`;

type ControlSubscriber = {
  omitOnValueChanged: (event: ValueChangedEvent<any>) => void;
  omitOnValueChanging: (event: ValueChangingEvent<any>) => void;
  omitOnNewPropValue: (event: {value: any}) => void;
  omitOnScrollStart: () => void;
  omitOnScrollEnd: () => void;
  disconnect: () => void;
};

type Control = {
  _connect: (info: {pickerName: string; value: any}) => ControlSubscriber;
};

const useControl = () => {
  const subsRef = useRef<
    Record<SubId, {pickerName: string; value: any; isStopped: boolean}>
  >({});

  const connect = useCallback<Control['_connect']>(({pickerName, value}) => {
    const subId = getNewSubId();
    subsRef.current[subId] = {pickerName, value, isStopped: true};
    const disconnect = () => {
      delete subsRef.current[subId];
    };

    return {
      disconnect,
      omitOnValueChanged: () => {},
      omitOnValueChanging: () => {},
      omitOnNewPropValue: () => {},
      omitOnScrollStart: () => {},
      omitOnScrollEnd: () => {},
    };
  }, []);
};

type YsePickerEventMergerResult = {
  control: any;
  useOnValueChangedEffect: (listener: () => void) => void;
  useOnValueChangingEffect: (listener: () => void) => void;
};

export const usePickerEventMerger = () => {
  return {
    control: any,
  } satisfies YsePickerEventMergerResult;
};
