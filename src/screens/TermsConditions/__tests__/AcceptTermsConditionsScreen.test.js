import messages from '@messages/en-HK.json';
import React from 'react';
import { ParagraphSkeletonPlaceholder, ErrorPanel } from '@wrappers/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import AcceptTermsConditionsScreen from '../AcceptTermsConditionsScreen';
import { CheckBox } from 'react-native-elements';
import { agreeTermsConditions, logout } from '@store/user/actions';
import { renderForTest } from '../../../testUtils';

const api = {
  getTermsAndConditions: jest.fn(() =>
    Promise.resolve({
      data: {
        content: 'terms and conditions content',
      },
    }),
  ),
};

const failedApi = {
  getTermsAndConditions: jest.fn(() => Promise.reject('error')),
};

const initialState = {
  intl: {
    messages,
    intlLocale: 'en-HK',
    momentLocale: 'en-gb',
    locale: 'en-HK',
    initialNow: Date.now(),
  },
  user: {},
};

jest.mock('@store/user/actions', () => ({
  agreeTermsConditions: jest.fn(() => ({
    type: 'dummy',
    payload: {},
  })),
  logout: jest.fn(() => ({
    type: 'dummy',
    payload: {},
  })),
}));

describe('TermsConditionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render terms and conditions', async () => {
    const Component = renderForTest(<AcceptTermsConditionsScreen />, {
      api,
      initialState,
    });
    expect(Component.getByType(ParagraphSkeletonPlaceholder)).toBeDefined();
    await flushMicrotasksQueue();
    expect(Component.getByText('terms and conditions content')).toBeDefined();
  });

  test('should render loader if accpeting term and condition', async done => {
    const Component = renderForTest(<AcceptTermsConditionsScreen />, {
      api,
      initialState,
    });
    await flushMicrotasksQueue();
    const checkboxes = Component.queryAllByType(CheckBox);
    const acceptBtn = Component.getAllByText(
      messages['tc.acceptTermsConditions'],
    );
    fireEvent.press(checkboxes[0]);
    fireEvent.press(checkboxes[1]);
    fireEvent.press(acceptBtn[0]);
    expect(agreeTermsConditions).toHaveBeenCalled();
    done();
  });

  test('should show error panel if api call failed', async () => {
    const Component = renderForTest(<AcceptTermsConditionsScreen />, {
      api: failedApi,
      initialState,
    });
    await flushMicrotasksQueue();
    expect(Component.getAllByType(ErrorPanel)[0]).toBeDefined();
  });

  test('should not able to click agree T&C if there are not enough two checkboxes clicks', async () => {
    const Component = renderForTest(<AcceptTermsConditionsScreen />, {
      api,
      initialState,
    });
    await flushMicrotasksQueue();

    const checkboxes = Component.queryAllByType(CheckBox);
    const acceptBtn = Component.getAllByText(
      messages['tc.acceptTermsConditions'],
    );
    fireEvent.press(checkboxes[1]);
    fireEvent.press(acceptBtn[0]);
    expect(agreeTermsConditions).not.toHaveBeenCalled();
  });

  test('should logout when click disagree button', async () => {
    const Component = renderForTest(<AcceptTermsConditionsScreen />, {
      api,
      initialState,
    });
    await flushMicrotasksQueue();

    const disagreeBtn = Component.getAllByText(
      messages['tc.disagreeTermAndCondition'],
    );
    fireEvent.press(disagreeBtn[0]);
    expect(logout).toHaveBeenCalled();
  });
});
