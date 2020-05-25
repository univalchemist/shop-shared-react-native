import React from 'react';
import { ErrorPanel, ParagraphSkeletonPlaceholder } from '@wrappers/components';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { render } from '@testUtils';
import TermsConditionsScreen from '../TermsConditionsScreen';

const api = {
  getTermsAndConditions: jest.fn(),
};

describe('TermsConditionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render terms and conditions', async () => {
    api.getTermsAndConditions.mockResolvedValueOnce({
      data: {
        content: 'terms and conditions content',
      },
    });

    const [Screen] = render(<TermsConditionsScreen />, {
      api,
    });

    expect(Screen.getByType(ParagraphSkeletonPlaceholder)).toBeDefined();

    await flushMicrotasksQueue();
    expect(Screen.getByText('terms and conditions content')).toBeDefined();
  });

  it('should render ErrorPanel on error', async () => {
    api.getTermsAndConditions.mockRejectedValueOnce(Error(''));
    const [Screen] = render(<TermsConditionsScreen />, {
      api,
    });

    await flushMicrotasksQueue();
    expect(Screen.getByType(ErrorPanel)).toBeDefined();
  });
});
