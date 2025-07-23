import {type RefObject, useEffect, useRef} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import type {ListMethods} from '../../types';

const useSyncScrollEffect = ({
  listRef,
  value,
  valueIndex,
  activeIndexRef,
  touching,
}: {
  listRef: RefObject<ListMethods>;
  value: unknown;
  valueIndex: number;
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
