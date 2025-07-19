import React, {FC, memo, useCallback, useMemo} from 'react';
import type {
  OnValueChanging,
  WheelPickerProps,
} from '@quidone/react-native-wheel-picker';
import {withVirtualized} from '@quidone/react-native-wheel-picker';
import {usePickerPropsChanger} from './PickerPropsChangerProvider';
import {useNativeFeedbackModule} from '../native-api-provider';

const useCallFeedback = () => {
  const nativeFeedbackModule = useNativeFeedbackModule();
  const {enabledSound, enabledImpact} = usePickerPropsChanger();
  return useMemo(() => {
    if (nativeFeedbackModule === 'NOT_SUPPORT_IN_SNACK') {
      return () => {};
    }
    switch (true) {
      case enabledSound && enabledImpact: return nativeFeedbackModule.triggerSoundAndImpact;  // eslint-disable-line prettier/prettier
      case enabledSound: return nativeFeedbackModule.triggerSound; // eslint-disable-line prettier/prettier
      case enabledImpact: return nativeFeedbackModule.triggerImpact; // eslint-disable-line prettier/prettier
      default: return () => {}; // eslint-disable-line prettier/prettier
    }
  }, [enabledImpact, enabledSound, nativeFeedbackModule]);
};

const withPropsChanger = <
  PropsT extends Pick<
    WheelPickerProps<any>,
    | 'enableScrollByTapOnItem'
    | 'visibleItemCount'
    | 'readOnly'
    | 'onValueChanged'
    | 'onValueChanging'
  >,
>(
  AnyPicker: FC<PropsT>,
) => {
  const WrappedPicker = ({
    onValueChanging: onValueChangingProp,
    ...restProps
  }: PropsT) => {
    const {
      enabledVirtualized,
      readOnly,
      visibleItemCount,
      enableScrollByTapOnItem,
    } = usePickerPropsChanger();
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
        return AnyPicker;
      }
      return withVirtualized(AnyPicker as any);
    }, [enabledVirtualized]);

    return (
      // @ts-ignore
      <ResultComponent
        visibleItemCount={visibleItemCount}
        readOnly={readOnly}
        enableScrollByTapOnItem={enableScrollByTapOnItem}
        {...(restProps as PropsT)}
        onValueChanging={onValueChanging}
      />
    );
  };

  WrappedPicker.displayName = `withPropsChanger(${AnyPicker.displayName})`;

  return memo(WrappedPicker) as unknown as typeof AnyPicker;
};

export default withPropsChanger;
