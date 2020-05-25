import * as React from 'react';
import { renderForTest } from '@testUtils';
import SnackBar from '@shops/components/SnackBar';
import { Text } from '@shops/wrappers/components';
import { Animated } from 'react-native';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

jest.useFakeTimers();

// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useState: jest.fn(),
// }));

describe('SnackBar', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });
  it('should render properly', async () => {
    const onSnackHided = jest.fn();
    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: jest.fn(callback => {
        callback?.();
      }),
    });
    const Comp = renderForTest(
      <SnackBar onSnackBarHided={() => onSnackHided()} autoHidingTime={null}>
        <Text>Some text</Text>
      </SnackBar>,
    );
    expect(Comp.queryByText('Some text')).toBeTruthy();
    await flushMicrotasksQueue();
    expect(onSnackHided).toBeCalled();
  });

  it('autoHidingtime should work properly', async () => {
    renderForTest(
      <SnackBar visible={true} autoHidingTime={2500} position={'top'}>
        <Text>Some text</Text>
      </SnackBar>,
    );
    await flushMicrotasksQueue();
    jest.clearAllTimers();
    expect(setTimeout).toBeCalledWith(expect.any(Function), 2500);
  });

  it('should run onLayout properly', async () => {
    const setState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(init => [init, setState]);

    const Comp = renderForTest(
      <SnackBar visible={true}>
        <Text>Some text</Text>
      </SnackBar>,
    );
    await flushMicrotasksQueue();

    const animatedView = Comp.getByTestId('animatedView');
    fireEvent(animatedView, 'layout', {
      nativeEvent: {
        layout: null,
      },
    });
    expect(setState).not.toBeCalled();
    fireEvent(animatedView, 'layout', {
      nativeEvent: {
        layout: {
          height: 80,
        },
      },
    });
    expect(setState).toBeCalledWith(80);
  });
});
