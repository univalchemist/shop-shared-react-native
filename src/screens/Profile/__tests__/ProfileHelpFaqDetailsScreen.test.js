import React from 'react';
import { renderForTestWithStore } from '@testUtils';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import ProfileHelpFaqDetailsScreen from '../ProfileHelpFaqDetailsScreen';
import { ErrorPanel } from '@wrappers/components';

const route = {
  params: {
    faq: {
      name: 'FaqSection1',
      content: 'FaqContent1',
    },
  },
};

describe('ProfileHelpFaqDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display correctly', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileHelpFaqDetailsScreen route={route} />,
      {},
    );

    await flushMicrotasksQueue();

    expect(Component.getByText('FaqContent1')).toBeDefined();
    expect(Component.toJSON()).toMatchSnapshot();
  });

  describe('Error handling', () => {
    const errorFaqs = [
      ['faq is undefined', undefined],
      ['faq name is undefined', { name: undefined, content: 'no name' }],
      ['faq content is undefined', { name: 'no content', content: undefined }],
    ];

    test.each(errorFaqs)(
      'should display the error panel when %s',
      async (_, faq) => {
        const newRoute = {
          ...route,
          params: {
            faq,
          },
        };
        const [Component] = renderForTestWithStore(
          <ProfileHelpFaqDetailsScreen route={newRoute} />,
          {},
        );

        await flushMicrotasksQueue();

        const errorPanel = Component.getByType(ErrorPanel);
        expect(errorPanel).toBeDefined();
      },
    );
  });
});
