import {useEffect, type RefObject} from 'react';
import {usePrevious} from '@rozhkov/react-useful-hooks';
import type {ListMethods} from '../../types';

const useSyncScrollEffect = ({
  listRef,
  valueIndex,
  touching,
}: {
  listRef: RefObject<ListMethods>;
  valueIndex: number;
  touching: boolean;
}) => {
  const prevIndex = usePrevious(valueIndex);

  useEffect(() => {
    if (
      listRef.current == null ||
      touching ||
      prevIndex == null ||
      prevIndex === valueIndex
    ) {
      return;
    }

    listRef.current.scrollToIndex({index: valueIndex, animated: true});
  }, [valueIndex]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSyncScrollEffect;
