import type {
  PickerItem,
  ValueChangedEvent,
  ValueChangingEvent,
} from '@implementation/base';
import {createNanoEvents, type Unsubscribe} from 'nanoevents';

type PickerName = string;
export type BaseControlConfig = Record<PickerName, {item: PickerItem<unknown>}>;

type MapToPickersFromConfig<T extends BaseControlConfig> = {
  [K in keyof T]: {name: K} & T[K];
}[keyof T][];

export type ControlEvents<ControlT extends Control = Control> = {
  onValueChanged: (event: {
    pickers: MapToPickersFromConfig<
      NonNullable<ControlT['__SAVED_TYPE_CONFIG__']>
    >;
  }) => void;
  onValueChanging: (event: {
    pickers: MapToPickersFromConfig<
      NonNullable<ControlT['__SAVED_TYPE_CONFIG__']>
    >;
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
  omitOnValueChanged: (event: ValueChangedEvent<PickerItem<unknown>>) => void;
  omitOnValueChanging: (event: ValueChangingEvent<PickerItem<unknown>>) => void;
  omitOnNewPropValue: (event: {item: PickerItem<unknown>}) => void;
  omitOnScrollStart: () => void;
  omitOnScrollEnd: () => void;
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
      const disconnect = () => {
        delete subscribers[subId];
        notifyChangedExtraValues(subId);
      };

      subEmitter.on('onNewPropValue', (event) => {
        if (!subscribers[subId]) {
          return;
        }

        subscribers[subId]!.item = event.item;
        console.log(
          '[create-control] subscribers',
          Object.entries(subscribers).map(([_, data]) => [
            data.pickerName,
            data.item.value,
          ]),
        );
        notifyChangedExtraValues(subId);
      });
      subEmitter.on('onValueChanged', (event) => {
        if (!subscribers[subId]) {
          return;
        }

        subscribers[subId]!.item = event.item;
        console.log(
          '[create-control] subscribers',
          Object.entries(subscribers).map(([_, data]) => [
            data.pickerName,
            data.item.value,
          ]),
        );

        const isAllStopped = getEveryIsStopped();
        console.log('isAllStopped', isAllStopped);
        if (isAllStopped) {
          Object.keys(subscribers).forEach((pickerId) => {
            const sub = subscribers[pickerId]!;
            sub.emitter.emit('onAllScrollEnd');
          });

          controlEmitter.emit('onValueChanged', {
            pickers: Object.values(subscribers).map((s) => ({
              name: s.pickerName,
              item: s.item,
            })),
          });
        }
      });
      subEmitter.on('onValueChanging', (event) => {
        if (!subscribers[subId]) {
          return;
        }

        subscribers[subId]!.item = event.item;
        console.log(
          '[create-control] subscribers',
          Object.entries(subscribers).map(([_, data]) => [
            data.pickerName,
            data.item.value,
          ]),
        );

        controlEmitter.emit('onValueChanging', {
          pickers: Object.values(subscribers).map((s) => ({
            name: s.pickerName,
            item: s.item,
          })),
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

      // TODO change omit -> emit
      return {
        getExtraValues: () => {
          return Object.keys(subscribers)
            .filter((id) => id !== subId)
            .map((id) => subscribers[id]!.item.value);
        },
        getEveryIsStopped,

        omitOnNewPropValue: (...args) => {
          console.log('[create-control] omitOnNewPropValue');
          subEmitter.emit('onNewPropValue', ...args);
        },
        omitOnValueChanged: (...args) => {
          console.log('[create-control] omitOnValueChanged');

          subEmitter.emit('onValueChanged', ...args);
        },
        omitOnValueChanging: (...args) => {
          // console.log('[create-control] omitOnValueChanging');

          subEmitter.emit('onValueChanging', ...args);
        },
        omitOnScrollStart: () => {
          console.log('[create-control] omitOnScrollStart');

          subEmitter.emit('onScrollStart');
        },
        omitOnScrollEnd: () => {
          console.log('[create-control] omitOnScrollEnd');

          subEmitter.emit('onScrollEnd');
        },

        onNewExtraValues: (callback) => {
          console.log('[create-control] onNewExtraValues');

          return subEmitter.on('onNewExtraValues', callback);
        },
        onAllScrollEnd: (callback) => {
          console.log('[create-control] onAllScrollEnd');

          return subEmitter.on('onAllScrollEnd', callback);
        },

        disconnect,
      } satisfies ControlSubscriber;
    },
  } satisfies Control<ConfigT>;
};
