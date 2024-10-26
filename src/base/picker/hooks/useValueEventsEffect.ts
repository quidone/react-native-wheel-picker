import {useCallback, useMemo, useRef} from 'react';
import {usePrevious, useStableCallback} from '@rozhkov/react-useful-hooks';
import debounce from '@utils/debounce';
import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

const useValueEventsEffect = <ItemT>(
  // in
  {
    valueIndex,
    data,
    itemHeight,
    offsetYAv,
    touching,
  }: {
    valueIndex: number;
    data: ReadonlyArray<ItemT>;
    itemHeight: number;
    offsetYAv: SharedValue<number>;
    touching: boolean;
  },
  // events
  {
    onValueChanging,
    onValueChanged,
  }: {
    onValueChanging?: (event: {item: ItemT; index: number}) => void;
    onValueChanged?: (event: {item: ItemT; index: number}) => void;
  },
) => {
  const activeIndexRef = useRef(valueIndex);
  activeIndexRef.current = valueIndex;
  const indexMax = data.length - 1;
  const getIndex = useStableCallback((offset: number) => {
    const calc = Math.trunc(offset / itemHeight);
    if (calc < 0) {
      return 0;
    } else if (calc > indexMax) {
      return indexMax;
    } else {
      const activeIndex = activeIndexRef.current;
      if (activeIndex === calc) {
        return activeIndex;
      } else if (calc > activeIndex) {
        return calc;
      } else {
        const hasPart = offset % itemHeight > 0;
        return calc + (hasPart ? 1 : 0);
      }
    }
  });

  const onStableValueChanged = useStableCallback(() => {
    if (onValueChanged === undefined || touching) {
      return;
    }
    const activeIndex = activeIndexRef.current;
    if (activeIndex !== valueIndex) {
      onValueChanged({index: activeIndex, item: data[activeIndex]!});
    }
  });
  const onValueChangedDebounce = useMemo(
    () => debounce(onStableValueChanged, 300),
    [onStableValueChanged],
  );

  // must be defined outside useAnimatedReaction
  const onOffsetChange = useCallback(
    (offset: number) => {
      onValueChangedDebounce();
      const index = getIndex(offset);
      const activeIndex = activeIndexRef.current;
      if (index !== activeIndex) {
        activeIndexRef.current = index;
        if (onValueChanging) {
          onValueChanging({
            item: data[index]!,
            index,
          });
        }
      }
    },
    [data, getIndex, onValueChanging, onValueChangedDebounce],
  );

  useAnimatedReaction(
    () => offsetYAv.value,
    (offset) => {
      runOnJS(onOffsetChange)(offset);
    },
    [onOffsetChange],
  );

  const prevTouching = usePrevious(touching);
  if (touching && !prevTouching) {
    onValueChangedDebounce.clear();
  } else if (!touching && prevTouching) {
    onValueChangedDebounce();
  }
};

export default useValueEventsEffect;
