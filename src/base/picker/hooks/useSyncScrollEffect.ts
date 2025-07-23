import {type RefObject, useEffect, useRef} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {useEffectWithDynamicDepsLength} from '@utils/react';
import type {ListMethods} from '../../types';

const useSyncScrollEffect = ({
  listRef,
  value,
  valueIndex,
  extraValues = [],
  activeIndexRef,
  touching,
}: {
  listRef: RefObject<ListMethods>;
  value: unknown;
  valueIndex: number;
  extraValues: unknown[] | undefined;
  activeIndexRef: RefObject<number>;
  touching: boolean;
}) => {
  const syncScroll = useStableCallback(() => {
    if (
      listRef.current == null ||
      touching ||
      activeIndexRef.current === valueIndex
    ) {
      return;
    }

    listRef.current.scrollToIndex({index: valueIndex, animated: true});
  });

  useEffect(() => {
    syncScroll();
  }, [valueIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffectWithDynamicDepsLength(() => {
    syncScroll();
  }, extraValues);

  const timeoutId = useRef<any>(undefined);
  const onScrollEnd = useStableCallback(() => {
    if (value !== undefined) {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(syncScroll, 0);
    }
  });

  return {
    onScrollEnd,
  };
};

export default useSyncScrollEffect;
