import {useEffect, useRef} from 'react';
import type {Animated} from 'react-native';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {getPageIndex} from '../../../utils/scrolling';
const useValueEventsEffect = <ItemT>(
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
  const getIndex = useStableCallback((offset: number) =>
    getPageIndex(offset, {
      maxIndex: data.length - 1,
      pageLength: itemHeight,
    }),
  );
  useEffect(() => {
    const id = offsetYAv.addListener(({value: offset}) => {
      const index = getIndex(offset);
      const activeIndex = activeIndexRef.current;
      if (index !== activeIndex) {
        activeIndexRef.current = index;
        onValueChanging?.({
          item: data[index]!,
          index,
        });
      }
    });
    return () => {
      offsetYAv.removeListener(id);
    };
  }, [data, getIndex, itemHeight, offsetYAv, onValueChanging]);
  const onStableValueChanged = useStableCallback(() => {
    const activeIndex = activeIndexRef.current;
    if (activeIndex !== valueIndex) {
      onValueChanged?.({
        index: activeIndex,
        item: data[activeIndex]!,
      });
    }
  });
  return {
    onScrollEnd: onStableValueChanged,
    activeIndexRef,
  };
};
export default useValueEventsEffect;
