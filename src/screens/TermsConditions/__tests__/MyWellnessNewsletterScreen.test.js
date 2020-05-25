import messages from '@messages/en-HK.json';
import React from 'react';
import { ParagraphSkeletonPlaceholder, ErrorPanel } from '@wrappers/components';
import {
  flushMicrotasksQueue,
  fireEvent,
  act,
} from 'react-native-testing-library';
import MyWellnessNewsletterScreen from '../MyWellnessNewsletterScreen';
import { renderForTest } from '../../../testUtils';
import mockNavigation from '@testUtils/__mocks__/navigation';

const api = {
  getMyWellnessNewsletter: jest.fn(() =>
    Promise.resolve({
      data: {
        content: 'my wellness newsletter',
      },
    }),
  ),
};

const failedApi = {
  getMyWellnessNewsletter: jest.fn(() => Promise.reject('error')),
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

describe('MyWellnessNewsletterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render my wellness newsletter screen', async () => {
    const Component = renderForTest(
      <MyWellnessNewsletterScreen navigation={mockNavigation} />,
      {
        api,
        initialState,
      },
    );
    expect(Component.getByType(ParagraphSkeletonPlaceholder)).toBeDefined();
    await flushMicrotasksQueue();
    expect(Component.getByText('my wellness newsletter')).toBeDefined();
  });

  test('should navigate when click on back button with goBackUrl', async () => {
    const route = {
      params: {
        goBackUrl: 'goBackUrl',
      },
    };

    const Component = renderForTest(
      <MyWellnessNewsletterScreen navigation={mockNavigation} route={route} />,
      {
        api,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const button = Component.getByProps({
      title: messages['wn.goback'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('goBackUrl');
  });

  test('should navigate go back when click on back button without goBackUrl', async () => {
    const navigation = mockNavigation;

    const Component = renderForTest(
      <MyWellnessNewsletterScreen navigation={navigation} />,
      {
        api,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const button = Component.getByProps({
      title: messages['wn.goback'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  test('should show error panel if api call failed', async () => {
    const Component = renderForTest(
      <MyWellnessNewsletterScreen navigation={mockNavigation} />,
      {
        api: failedApi,
        initialState,
      },
    );
    await flushMicrotasksQueue();
    expect(Component.getAllByType(ErrorPanel)[0]).toBeDefined();
  });
});
