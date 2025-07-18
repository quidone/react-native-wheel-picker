import {type RefObject, useRef} from 'react';
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
  enableSyncScrollAfterScrollEnd,
}: {
  listRef: RefObject<ListMethods>;
  value: unknown;
  valueIndex: number;
  extraValues: unknown[] | undefined;
  activeIndexRef: RefObject<number>;
  touching: boolean;
  enableSyncScrollAfterScrollEnd: boolean;
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

  useEffectWithDynamicDepsLength(() => {
    syncScroll();
  }, [valueIndex, enableSyncScrollAfterScrollEnd, ...extraValues]);

  const timeoutId = useRef<any>(undefined);
  const onScrollEnd = useStableCallback(() => {
    if (enableSyncScrollAfterScrollEnd && value !== undefined) {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(syncScroll, 0);
    }
  });

  return {
    onScrollEnd,
  };
};

export default useSyncScrollEffect;
