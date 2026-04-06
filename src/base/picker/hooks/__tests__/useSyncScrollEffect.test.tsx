import React from 'react';
import type {RefObject} from 'react';
import renderer, {act, type ReactTestRenderer} from 'react-test-renderer';
import useSyncScrollEffect from '../useSyncScrollEffect';
import type {ListMethods} from '../../../types';

type HookProps = Parameters<typeof useSyncScrollEffect>[0];
type HookHandlers = ReturnType<typeof useSyncScrollEffect>;

let latestHandlers: HookHandlers;

const HookHost = (props: HookProps) => {
  latestHandlers = useSyncScrollEffect(props);
  return null;
};

const flushTimers = (time?: number) => {
  act(() => {
    if (time == null) {
      jest.runOnlyPendingTimers();
      return;
    }
    jest.advanceTimersByTime(time);
  });
};

const renderHook = (overrides: Partial<HookProps> = {}) => {
  const scrollToIndex = jest.fn();
  const listRef = {
    current: {scrollToIndex},
  } as RefObject<ListMethods | null>;
  const activeIndexRef = {current: 1};

  let props: HookProps = {
    listRef,
    value: 'one',
    valueIndex: 1,
    extraValues: [],
    activeIndexRef,
    touching: false,
    enableSyncScrollAfterScrollEnd: true,
    ...overrides,
  };

  let root: ReactTestRenderer;

  act(() => {
    root = renderer.create(<HookHost {...props} />);
  });

  flushTimers();
  scrollToIndex.mockClear();

  return {
    activeIndexRef,
    scrollToIndex,
    update(nextProps: Partial<HookProps>) {
      props = {...props, ...nextProps};
      act(() => {
        root.update(<HookHost {...props} />);
      });
    },
    unmount() {
      act(() => {
        root.unmount();
      });
    },
  };
};

describe('useSyncScrollEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    flushTimers();
    jest.useRealTimers();
  });

  test('schedules sync 100ms after scroll end when value is not updated', () => {
    const hook = renderHook();

    hook.activeIndexRef.current = 3;

    act(() => {
      latestHandlers.onScrollEnd();
    });

    flushTimers(99);
    expect(hook.scrollToIndex).not.toHaveBeenCalled();

    flushTimers(1);
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      animated: true,
    });

    hook.unmount();
  });

  test('syncs immediately when valueIndex changes', () => {
    const hook = renderHook();

    hook.activeIndexRef.current = 1;
    hook.update({value: 'two', valueIndex: 2});

    flushTimers();
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 2,
      animated: true,
    });

    hook.unmount();
  });

  test('syncs immediately when extraValues change', () => {
    const hook = renderHook();

    hook.activeIndexRef.current = 4;
    hook.update({extraValues: ['changed']});

    flushTimers();
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      animated: true,
    });

    hook.unmount();
  });

  test('cancels pending sync on scroll start', () => {
    const hook = renderHook();

    hook.activeIndexRef.current = 2;

    act(() => {
      latestHandlers.onScrollEnd();
    });

    flushTimers(50);

    act(() => {
      latestHandlers.onScrollStart();
    });

    flushTimers(100);
    expect(hook.scrollToIndex).not.toHaveBeenCalled();

    hook.unmount();
  });

  test('delays sync when enableSyncScrollAfterScrollEnd becomes true while idle', () => {
    const hook = renderHook({enableSyncScrollAfterScrollEnd: false});

    hook.activeIndexRef.current = 2;
    hook.update({enableSyncScrollAfterScrollEnd: true});

    flushTimers(99);
    expect(hook.scrollToIndex).not.toHaveBeenCalled();

    flushTimers(1);
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      animated: true,
    });

    hook.unmount();
  });

  test('waits for scroll end when enableSyncScrollAfterScrollEnd becomes true during scrolling', () => {
    const hook = renderHook({enableSyncScrollAfterScrollEnd: false});

    hook.activeIndexRef.current = 2;

    act(() => {
      latestHandlers.onScrollStart();
    });

    hook.update({enableSyncScrollAfterScrollEnd: true});

    flushTimers(200);
    expect(hook.scrollToIndex).not.toHaveBeenCalled();

    act(() => {
      latestHandlers.onScrollEnd();
    });

    flushTimers(99);
    expect(hook.scrollToIndex).not.toHaveBeenCalled();

    flushTimers(1);
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 1,
      animated: true,
    });

    hook.unmount();
  });

  test('replaces an old delayed sync with a new immediate one', () => {
    const hook = renderHook();

    hook.activeIndexRef.current = 2;

    act(() => {
      latestHandlers.onScrollEnd();
    });

    hook.update({value: 'three', valueIndex: 3});

    flushTimers();
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(hook.scrollToIndex).toHaveBeenCalledWith({
      index: 3,
      animated: true,
    });

    flushTimers(200);
    expect(hook.scrollToIndex).toHaveBeenCalledTimes(1);

    hook.unmount();
  });
});
