import {type RefObject, useEffect} from 'react';
import type {ListMethods} from '../../types';

const useSyncScrollEffect = ({
  listRef,
  valueIndex,
  activeIndexRef,
  touching,
}: {
  listRef: RefObject<ListMethods>;
  valueIndex: number;
  activeIndexRef: RefObject<number>;
  touching: boolean;
}) => {
  useEffect(() => {
    if (
      listRef.current == null ||
      touching ||
      activeIndexRef.current === valueIndex
    ) {
      return;
    }

    listRef.current.scrollToIndex({index: valueIndex, animated: true});
  }, [valueIndex]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSyncScrollEffect;
