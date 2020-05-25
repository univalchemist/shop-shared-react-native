import React from 'react';
import { renderForTestWithStore } from '@testUtils';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import ProfileHelpFaqScreen from '../ProfileHelpFaqScreen';
import { PROFILE_HELP_FAQ_DETAILS } from '@routes';
import { ErrorPanel } from '@wrappers/components';

const faqs = [
  {
    name: 'FaqSection1',
    content: 'FaqContent1',
  },
  {
    name: 'FaqSection2',
    content: 'FaqContent2',
  },
];

const navigation = { navigate: jest.fn() };
const route = { params: { faqs } };

describe('ProfileHelpFaqScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display correctly when data successfully loads', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileHelpFaqScreen navigation={navigation} route={route} />,
      {},
    );

    await flushMicrotasksQueue();

    expect(Component.getByText('FaqSection1')).toBeDefined();
    expect(Component.getByText('FaqSection2')).toBeDefined();
    expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should navigate to the FaqDetails screen', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileHelpFaqScreen navigation={navigation} route={route} />,
      {},
    );
    await flushMicrotasksQueue();
    const tappableFaq = Component.getByText('FaqSection1');
    await fireEvent.press(tappableFaq);

    expect(navigation.navigate).toBeCalledTimes(1);
    expect(navigation.navigate).toBeCalledWith(PROFILE_HELP_FAQ_DETAILS, {
      faq: faqs[0],
    });
  });

  describe('Error handling', () => {
    const faqsStates = [
      ['faqs is undefined', undefined],
      ['faqs is null', null],
      ['faqs is empty', {}],
    ];

    test.each(faqsStates)(
      'should display the error panel when %s',
      async (_, faqState) => {
        const newRoute = {
          ...route,
          params: {
            faqs: faqState,
          },
        };
        const [Component] = renderForTestWithStore(
          <ProfileHelpFaqScreen navigation={navigation} route={newRoute} />,
          {},
        );

        await flushMicrotasksQueue();

        const errorPanel = Component.getByType(ErrorPanel);
        expect(errorPanel).toBeDefined();
      },
    );
  });

  it('should render error panel when faqs is null', async () => {
    const newRoute = {
      ...route,
      params: {
        faqs: null,
      },
    };
    const [Component] = renderForTestWithStore(
      <ProfileHelpFaqScreen navigation={navigation} route={newRoute} />,
      {},
    );
    await flushMicrotasksQueue();
    const errorPanel = Component.getByType(ErrorPanel);
    expect(errorPanel).toBeDefined();
  });

  it('should render error panel when faqs is empty', async () => {
    const newRoute = {
      ...route,
      params: {
        faqs: [],
      },
    };
    const [Component] = renderForTestWithStore(
      <ProfileHelpFaqScreen navigation={navigation} route={newRoute} />,
      {},
    );
    await flushMicrotasksQueue();
    const errorPanel = Component.getByType(ErrorPanel);
    expect(errorPanel).toBeDefined();
  });
});
