import {type RefObject, useEffect, useRef} from 'react';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import {useEffectWithDynamicDepsLength} from '@utils/react';
import type {ListMethods} from '../../types';

const SYNC_SCROLL_DELAY_MS = 100;

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
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const isScrollingRef = useRef(false);
  const prevEnableSyncScrollAfterScrollEnd = useRef(
    enableSyncScrollAfterScrollEnd,
  );

  const cancelSyncScroll = useStableCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = undefined;
  });

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

  const scheduleSyncScroll = useStableCallback((delay: number) => {
    cancelSyncScroll();
    timeoutId.current = setTimeout(() => {
      timeoutId.current = undefined;
      syncScroll();
    }, delay);
  });

  useEffect(() => cancelSyncScroll, [cancelSyncScroll]);

  useEffect(() => {
    const prevEnabled = prevEnableSyncScrollAfterScrollEnd.current;
    prevEnableSyncScrollAfterScrollEnd.current = enableSyncScrollAfterScrollEnd;

    if (!enableSyncScrollAfterScrollEnd) {
      cancelSyncScroll();
      return;
    }

    if (!prevEnabled && value !== undefined && !isScrollingRef.current) {
      scheduleSyncScroll(SYNC_SCROLL_DELAY_MS);
    }
  }, [
    cancelSyncScroll,
    enableSyncScrollAfterScrollEnd,
    scheduleSyncScroll,
    value,
  ]);

  useEffectWithDynamicDepsLength(() => {
    if (value === undefined) {
      return;
    }
    scheduleSyncScroll(0);
  }, [valueIndex, ...extraValues]);

  const onScrollStart = useStableCallback(() => {
    isScrollingRef.current = true;
    cancelSyncScroll();
  });

  const onScrollEnd = useStableCallback(() => {
    isScrollingRef.current = false;

    if (enableSyncScrollAfterScrollEnd && value !== undefined) {
      scheduleSyncScroll(SYNC_SCROLL_DELAY_MS);
    }
  });

  return {
    onScrollStart,
    onScrollEnd,
  };
};

export default useSyncScrollEffect;
