import {useEffect, useRef} from 'react';
import type {Animated} from 'react-native';
import {useStableCallback} from '@rozhkov/react-useful-hooks';

const useValueEventsEffect = <ItemT>(
  // in
  {
    valueIndex,
    data,
    itemHeight,
    offsetYAv,
  }: {
    valueIndex: number;
    data: ReadonlyArray<ItemT>;
    itemHeight: number;
    offsetYAv: Animated.Value;
  },
  // events
  {
    onValueChanging,
    onValueChanged,
  }: {
    onValueChanging:
      | ((event: {item: ItemT; index: number}) => void)
      | undefined;
    onValueChanged: ((event: {item: ItemT; index: number}) => void) | undefined;
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

  useEffect(() => {
    const id = offsetYAv.addListener(({value: offset}) => {
      const index = getIndex(offset);
      const activeIndex = activeIndexRef.current;
      if (index !== activeIndex) {
        activeIndexRef.current = index;
        onValueChanging?.({item: data[index]!, index});
      }
    });
    return () => {
      offsetYAv.removeListener(id);
    };
  }, [data, getIndex, itemHeight, offsetYAv, onValueChanging]);

  const onStableValueChanged = useStableCallback(() => {
    const activeIndex = activeIndexRef.current;
    if (activeIndex !== valueIndex) {
      onValueChanged?.({index: activeIndex, item: data[activeIndex]!});
    }
  });

  return {onScrollEnd: onStableValueChanged};
};

export default useValueEventsEffect;
