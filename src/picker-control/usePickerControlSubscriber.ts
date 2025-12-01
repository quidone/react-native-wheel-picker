import {useEffect, useState} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import type {PickerItem} from '../base';
import type {Control, ControlSubscriber} from './create-control';
const useConnectSub = ({
  control,
  pickerName,
  currentItem,
}: {
  control: Control;
  pickerName: string;
  currentItem: PickerItem<unknown>;
}) => {
  const [subscriber, setSubscriber] = useState<ControlSubscriber | null>(null);
  useEffect(() => {
    const sub = control._connect({
      pickerName,
      item: currentItem,
    });
    setSubscriber(sub);
    return () => {
      sub.disconnect();
    };
  }, [control, pickerName]); // eslint-disable-line react-hooks/exhaustive-deps

  return subscriber;
};
export const usePickerControlSubscriber = ({
  control,
  pickerName,
  currentItem,
}: {
  control: Control;
  pickerName: string;
  currentItem: PickerItem<unknown>;
}) => {
  const subscriber = useConnectSub({
    control,
    pickerName,
    currentItem,
  });
  const [extraValues, setExtraValues] = useState<unknown[]>([]);
  const [enableSyncScrollAfterScrollEnd, setEnableSyncScrollAfterScrollEnd] =
    useState(true);
  const onScrollStart = useStableCallback(() => {
    setEnableSyncScrollAfterScrollEnd(false);
    subscriber?.emitOnScrollStart();
  });
  const onScrollEnd = useStableCallback(subscriber?.emitOnScrollEnd);
  const emitOnValueChanged = useStableCallback(subscriber?.emitOnValueChanged);
  const emitOnValueChanging = useStableCallback(
    subscriber?.emitOnValueChanging,
  );
  useEffect(() => {
    if (!subscriber) {
      return;
    }
    setExtraValues(subscriber.getExtraValues());
    const unsubscribeNewExtraValues = subscriber.onNewExtraValues(() => {
      setExtraValues(subscriber.getExtraValues());
    });
    setEnableSyncScrollAfterScrollEnd(subscriber.getEveryIsStopped());
    const unsubscribeAllScrollEnd = subscriber.onAllScrollEnd(() => {
      setEnableSyncScrollAfterScrollEnd(subscriber.getEveryIsStopped());
    });
    return () => {
      unsubscribeNewExtraValues();
      unsubscribeAllScrollEnd();
    };
  }, [subscriber]);
  useEffect(() => {
    subscriber?.emitOnNewPropValue({
      item: currentItem,
    });
  }, [currentItem, subscriber]);
  return {
    extraValues,
    enableSyncScrollAfterScrollEnd,
    onScrollStart,
    onScrollEnd,
    emitOnValueChanged,
    emitOnValueChanging,
  };
};
