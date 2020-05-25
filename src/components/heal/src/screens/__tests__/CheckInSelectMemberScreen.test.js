import React from 'react';
import { renderForTest } from '@testUtils';
import {
  flushMicrotasksQueue,
  fireEvent,
  act,
} from 'react-native-testing-library';
import { CheckInSelectMemberScreen } from '@heal/src/screens';
import { RadioButtonGroup } from '@wrappers/components/form';
import * as checkIphone from '@utils/isIphoneX';
import { Button } from '@heal/src/wrappers/components';
import { CHECK_IN_FORM } from '@routes';

jest.mock('@utils/isIphoneX');

describe('CheckInSelectMemberScreen', () => {
  test('render myself and dependents', async () => {
    checkIphone.isIphoneX.mockReturnValue(false);
    const initialState = {
      user: {
        userId: 1,
        membersMap: {
          1: { name: 'test', memberId: '1' },
          2: { name: 'dep2', memberId: '2' },
          3: { name: 'dep3', memberId: '3' },
        },
      },
    };
    const nav = { navigate: jest.fn() };
    const screen = renderForTest(
      <CheckInSelectMemberScreen navigation={nav} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const radioGroup = screen.getByType(RadioButtonGroup);
    const expected = [
      { label: 'Myself', value: '1' },
      { label: 'dep2', value: '2' },
      { label: 'dep3', value: '3' },
    ];
    expect(radioGroup.props.options).toEqual(expected);
    const myself = screen.getByText('Myself');
    const button = screen.getByType(Button);
    fireEvent(myself, 'press');
    fireEvent(button, 'press');
    await flushMicrotasksQueue();
    expect(nav.navigate).toBeCalledWith(CHECK_IN_FORM);
  });

  test('render no user', async () => {
    const nav = { navigate: jest.fn() };
    checkIphone.isIphoneX.mockReturnValue(true);
    const initialState = {
      user: {
        userId: 1,
        membersMap: {},
      },
    };
    const screen = renderForTest(
      <CheckInSelectMemberScreen navigation={nav} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const radioGroup = screen.getByType(RadioButtonGroup);
    expect(radioGroup.props.options).toEqual([]);
  });
});
