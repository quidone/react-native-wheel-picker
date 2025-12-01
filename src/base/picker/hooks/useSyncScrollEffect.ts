import {type RefObject, useRef} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {useEffectWithDynamicDepsLength} from '../../../utils/react';
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
  listRef: RefObject<ListMethods | null>;
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
    listRef.current.scrollToIndex({
      index: valueIndex,
      animated: true,
    });
  });
  const timeoutId = useRef<any>(undefined);
  useEffectWithDynamicDepsLength(() => {
    clearTimeout(timeoutId.current);
    // fix: loops between two values. We are making a small delay so that the value in other places can be updated for verification.
    timeoutId.current = setTimeout(syncScroll, 0);
  }, [valueIndex, enableSyncScrollAfterScrollEnd, ...extraValues]);
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
