import React, {FC, useCallback, useMemo} from 'react';
import type {
  default as WheelPicker,
  OnValueChanging,
  WheelPickerProps,
} from '@quidone/react-native-wheel-picker';
import {usePickerConfig} from './PickerConfigProvider';
import WheelPickerFeedback from '@quidone/react-native-wheel-picker-feedback';
import {withVirtualized} from '@quidone/react-native-wheel-picker';

const useCallFeedback = () => {
  const {enabledSound, enabledImpact} = usePickerConfig();
  return useMemo(() => {
    switch (true) {
      case enabledSound && enabledImpact: return WheelPickerFeedback.getSoundAndImpact;  // eslint-disable-line prettier/prettier
      case enabledSound: return WheelPickerFeedback.getSound; // eslint-disable-line prettier/prettier
      case enabledImpact: return WheelPickerFeedback.getImpact; // eslint-disable-line prettier/prettier
      default: return () => {}; // eslint-disable-line prettier/prettier
    }
  }, [enabledImpact, enabledSound]);
};

const withExamplePickerConfig = (
  WrappedComponent: FC<WheelPickerProps<any>>,
) => {
  const Wrapper = ({
    onValueChanging: onValueChangingProp,
    ...restProps
  }: WheelPickerProps<any>) => {
    const {enabledVirtualized} = usePickerConfig();
    const callFeedback = useCallFeedback();

    const onValueChanging = useCallback<OnValueChanging<any>>(
      (...args) => {
        callFeedback();
        onValueChangingProp?.(...args);
      },
      [callFeedback, onValueChangingProp],
    );

    const ResultComponent = useMemo(() => {
      if (!enabledVirtualized) {
        return WrappedComponent;
      }
      return withVirtualized(WrappedComponent as any);
    }, [enabledVirtualized]);

    return <ResultComponent {...restProps} onValueChanging={onValueChanging} />;
  };

  Wrapper.displayName = `withExamplePickerConfig(${WrappedComponent.displayName})`;

  return Wrapper as typeof WheelPicker;
};

export default withExamplePickerConfig;
