import React from 'react';
import { ErrorPanel, ParagraphSkeletonPlaceholder } from '@wrappers/components';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { render } from '@testUtils';
import PrivacyPolicyScreen from '../PrivacyPolicyScreen';

const api = {
  getPrivacyPolicy: jest.fn(),
};

describe('PrivacyPolicyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render privacy policy', async () => {
    api.getPrivacyPolicy.mockResolvedValueOnce({
      data: {
        content: 'privacy policy content',
      },
    });

    const [Screen] = render(<PrivacyPolicyScreen />, {
      api,
    });

    expect(Screen.getByType(ParagraphSkeletonPlaceholder)).toBeDefined();

    await flushMicrotasksQueue();
    expect(Screen.getByText('privacy policy content')).toBeDefined();
  });

  it('should render ErrorPanel on error', async () => {
    api.getPrivacyPolicy.mockRejectedValueOnce(Error(''));
    const [Screen] = render(<PrivacyPolicyScreen />, {
      api,
    });

    await flushMicrotasksQueue();
    expect(Screen.getByType(ErrorPanel)).toBeDefined();
  });
});
