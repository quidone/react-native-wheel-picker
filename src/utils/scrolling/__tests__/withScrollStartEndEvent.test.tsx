import React, {forwardRef} from 'react';
import renderer, {act, type ReactTestRenderer} from 'react-test-renderer';
import {Animated} from 'react-native';
import withScrollStartEndEvent from '../withScrollStartEndEvent';

type CapturedProps = Record<string, any>;

let latestProps: CapturedProps | null = null;

const MockScrollComponent = forwardRef<any, CapturedProps>((props, _ref) => {
  latestProps = props;
  return null;
});

const WrappedScrollComponent = withScrollStartEndEvent(MockScrollComponent);

const flushTimers = (time?: number) => {
  act(() => {
    if (time == null) {
      jest.runOnlyPendingTimers();
      return;
    }

    jest.advanceTimersByTime(time);
  });
};

describe('withScrollStartEndEvent', () => {
  let root: ReactTestRenderer;
  let scrollOffset: Animated.Value;
  let onScrollStart: jest.Mock;
  let onScrollEnd: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    latestProps = null;
    scrollOffset = new Animated.Value(0);
    onScrollStart = jest.fn();
    onScrollEnd = jest.fn();

    act(() => {
      root = renderer.create(
        <WrappedScrollComponent
          scrollOffset={scrollOffset}
          onScrollStart={onScrollStart}
          onScrollEnd={onScrollEnd}
        />,
      );
    });
  });

  afterEach(() => {
    flushTimers();
    act(() => {
      root.unmount();
    });
    jest.useRealTimers();
  });

  test('fires scroll end after the last implicit offset update', () => {
    act(() => {
      scrollOffset.setValue(10);
      scrollOffset.setValue(20);
      scrollOffset.setValue(30);
    });

    expect(onScrollStart).toHaveBeenCalledTimes(1);
    expect(onScrollEnd).not.toHaveBeenCalled();

    flushTimers(99);
    expect(onScrollEnd).not.toHaveBeenCalled();

    flushTimers(1);
    expect(onScrollEnd).toHaveBeenCalledTimes(1);
  });

  test('does not emit scroll end from offset updates while native scrolling is active', () => {
    act(() => {
      latestProps?.onScrollBeginDrag?.({nativeEvent: {}} as any);
      scrollOffset.setValue(10);
      scrollOffset.setValue(20);
    });

    flushTimers(200);
    expect(onScrollStart).toHaveBeenCalledTimes(1);
    expect(onScrollEnd).not.toHaveBeenCalled();

    act(() => {
      latestProps?.onMomentumScrollEnd?.({nativeEvent: {}} as any);
    });

    flushTimers(99);
    expect(onScrollEnd).not.toHaveBeenCalled();

    flushTimers(1);
    expect(onScrollEnd).toHaveBeenCalledTimes(1);
  });
});
