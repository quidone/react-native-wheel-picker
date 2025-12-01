import type {PickerItem, ValueChangedEvent, ValueChangingEvent} from '../base';
import {createNanoEvents, type Unsubscribe} from '../utils/nanoevents';
type PickerName = string;
export type BaseControlConfig = Record<
  PickerName,
  {
    item: PickerItem<unknown>;
  }
>;
export type ControlEvents<ControlT extends Control = Control> = {
  onValueChanged: (event: {
    pickers: NonNullable<ControlT['__SAVED_TYPE_CONFIG__']>;
  }) => void;
  onValueChanging: (event: {
    pickers: NonNullable<ControlT['__SAVED_TYPE_CONFIG__']>;
  }) => void;
};
type SubscriberEvents = {
  // emit from subscriber
  onValueChanged: (event: ValueChangedEvent<PickerItem<unknown>>) => void;
  onValueChanging: (event: ValueChangingEvent<PickerItem<unknown>>) => void;
  onNewPropValue: (event: {item: PickerItem<unknown>}) => void;
  onScrollStart: () => void;
  onScrollEnd: () => void;

  // emit to subscriber
  onNewExtraValues: () => void;
  onAllScrollEnd: () => void;
};
type SubId = string;
let nextSubId = 1;
const getNewSubId = (): SubId => `${++nextSubId}`;
export type ControlSubscriber = {
  getExtraValues: () => unknown[];
  getEveryIsStopped: () => boolean;
  emitOnValueChanged: (event: ValueChangedEvent<PickerItem<unknown>>) => void;
  emitOnValueChanging: (event: ValueChangingEvent<PickerItem<unknown>>) => void;
  emitOnNewPropValue: (event: {item: PickerItem<unknown>}) => void;
  emitOnScrollStart: () => void;
  emitOnScrollEnd: () => void;
  onNewExtraValues: (cb: () => void) => Unsubscribe;
  onAllScrollEnd: (cb: () => void) => Unsubscribe;
  disconnect: () => void;
};
export type Control<ConfigT extends BaseControlConfig = BaseControlConfig> = {
  _connect: (info: {
    pickerName: PickerName;
    item: PickerItem<unknown>;
  }) => ControlSubscriber;
  _on: <NameT extends keyof ControlEvents>(
    event: NameT,
    callback: ControlEvents[NameT],
  ) => Unsubscribe;

  // It's used to simplify typing from outside, in the future it makes sense to make better typing inside
  __SAVED_TYPE_CONFIG__?: ConfigT;
};
export const createControl = <
  ConfigT extends BaseControlConfig,
>(): Control<ConfigT> => {
  const controlEmitter = createNanoEvents<ControlEvents>();
  const subscribers: Record<
    SubId,
    {
      pickerName: string;
      item: PickerItem<unknown>;
      isStopped: boolean;
      emitter: ReturnType<typeof createNanoEvents<SubscriberEvents>>;
    }
  > = {};
  const getEveryIsStopped = () => {
    return Object.values(subscribers).every((s) => s.isStopped);
  };
  const notifyChangedExtraValues = (notifierPickerId: string) => {
    Object.keys(subscribers).forEach((pickerId) => {
      if (pickerId === notifierPickerId) {
        return;
      }
      const sub = subscribers[pickerId]!;
      sub.emitter.emit('onNewExtraValues');
    });
  };
  return {
    _on: (event, callback) => {
      return controlEmitter.on(event, callback);
    },
    _connect: ({pickerName, item}) => {
      if (__DEV__) {
        const isExisted = Object.values(subscribers).some(
          (s) => s.pickerName === pickerName,
        );
        if (isExisted) {
          throw new Error(
            `It is not possible to register 2 pickers with the same name "${pickerName}"`,
          );
        }
      }
      const subEmitter = createNanoEvents<SubscriberEvents>();
      const subId = getNewSubId();
      subscribers[subId] = {
        pickerName,
        item,
        isStopped: true,
        emitter: subEmitter,
      };
      const getEventPickers = () => {
        const result: Record<
          string,
          BaseControlConfig[keyof BaseControlConfig]
        > = {};
        Object.entries(subscribers).forEach(([_, data]) => {
          result[data.pickerName as string] = {
            item: data.item,
          };
        });
        return result as ConfigT;
      };
      const disconnect = () => {
        delete subscribers[subId];
        notifyChangedExtraValues(subId);
      };
      subEmitter.on('onNewPropValue', (event) => {
        if (!subscribers[subId]) {
          return;
        }
        subscribers[subId]!.item = event.item;
        notifyChangedExtraValues(subId);
      });
      subEmitter.on('onValueChanged', (event) => {
        if (!subscribers[subId]) {
          return;
        }
        subscribers[subId]!.item = event.item;
        const isAllStopped = getEveryIsStopped();
        if (isAllStopped) {
          Object.keys(subscribers).forEach((pickerId) => {
            const sub = subscribers[pickerId]!;
            sub.emitter.emit('onAllScrollEnd');
          });
          controlEmitter.emit('onValueChanged', {
            pickers: getEventPickers(),
          });
        }
      });
      subEmitter.on('onValueChanging', (event) => {
        if (!subscribers[subId]) {
          return;
        }
        subscribers[subId]!.item = event.item;
        controlEmitter.emit('onValueChanging', {
          pickers: getEventPickers(),
        });
      });
      subEmitter.on('onScrollStart', () => {
        if (!subscribers[subId]) {
          return;
        }
        subscribers[subId]!.isStopped = false;
      });
      subEmitter.on('onScrollEnd', () => {
        if (!subscribers[subId]) {
          return;
        }
        subscribers[subId]!.isStopped = true;
      });
      return {
        getExtraValues: () => {
          return Object.keys(subscribers)
            .filter((id) => id !== subId)
            .map((id) => subscribers[id]!.item.value);
        },
        getEveryIsStopped,
        emitOnNewPropValue: (...args) => {
          subEmitter.emit('onNewPropValue', ...args);
        },
        emitOnValueChanged: (...args) => {
          subEmitter.emit('onValueChanged', ...args);
        },
        emitOnValueChanging: (...args) => {
          subEmitter.emit('onValueChanging', ...args);
        },
        emitOnScrollStart: () => {
          subEmitter.emit('onScrollStart');
        },
        emitOnScrollEnd: () => {
          subEmitter.emit('onScrollEnd');
        },
        onNewExtraValues: (callback) => {
          return subEmitter.on('onNewExtraValues', callback);
        },
        onAllScrollEnd: (callback) => {
          return subEmitter.on('onAllScrollEnd', callback);
        },
        disconnect,
      } satisfies ControlSubscriber;
    },
  } satisfies Control<ConfigT>;
};
