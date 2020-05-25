import { renderForTest } from '@testUtils';
import React from 'react';
import { Button } from '@wrappers/components';
import { CLAIM_REVIEW } from '@routes';
import messages from '@messages/en-HK.json';
import ClaimUploadDocumentsScreen from '../ClaimUploadDocumentsScreen';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';

jest.useFakeTimers();
jest.mock('@utils/nativeImageHelpers', () => ({
  compressImage: jest.fn(x => x),
  getImageFromImagePicker: jest.fn(),
}));

describe('ClaimUploadDocumentsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to claim review on pressing next button', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: { claimTypeId: 1, documents: [{ uri: '111' }] },
        },
      },
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: false,
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn() };
    const { getByType } = renderForTest(
      <ClaimUploadDocumentsScreen navigation={navigation} />,
      { initialState },
    );
    const button = getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();
    expect(navigation.navigate.mock.calls.length).toBe(1);
    expect(navigation.navigate.mock.calls[0][0]).toBe(CLAIM_REVIEW);
  });

  it('should display the referral section if referral upload is required', () => {
    const initialState = {
      form: { claimDetailsForm: { values: { claimTypeId: 1 } } },
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: true,
            },
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });
    expect(screen.getByText(messages['claim.section.referrals'])).toBeDefined();
    expect(
      screen.getByText(messages['claim.referralLettersInfo']),
    ).toBeDefined();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  test('should display settlement advice and referral uploader', () => {
    const initialState = {
      form: {
        claimDetailsForm: { values: { claimTypeId: 1, isMultiInsurer: true } },
      },
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: true,
            },
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });
    expect(screen.getByText(messages['claim.section.referrals'])).toBeDefined();
    expect(
      screen.getByText(messages['claim.section.settlementAdvices']),
    ).toBeDefined();
  });

  test('should display settlement advice, referral and Prescriptions uploader', () => {
    const initialState = {
      form: {
        claimDetailsForm: { values: { claimTypeId: 1, isMultiInsurer: true } },
      },
      claimType: {
        types: {
          byId: {
            1: {
              code: 'NF-CHNHERBA',
              referralRequired: true,
            },
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });
    expect(screen.getByText(messages['claim.section.referrals'])).toBeDefined();
    expect(
      screen.getByText(messages['claim.section.settlementAdvices']),
    ).toBeDefined();
    expect(
      screen.getByText(messages['claim.section.prescriptions']),
    ).toBeDefined();
  });

  it('should navigate to the viewer modal after referral is added', async () => {
    const initialState = {
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: true,
            },
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            receiptAmount: '100',
            otherInsurerAmount: '50',
            claimTypeId: 1,
            referrals: [{ uri: 'test', type: 'application/pdf' }],
          },
        },
      },
    };
    const navigation = { navigate: jest.fn() };
    const screen = renderForTest(
      <ClaimUploadDocumentsScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();

    const thumbnail = screen.getByProps({
      accessibilityLabel: 'View document of Referral letter',
    });
    await fireEvent.press(thumbnail);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should validate there is a referral letter when required', () => {
    const initialState = {
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: true,
            },
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            receiptAmount: '100',
            otherInsurerAmount: '50',
            claimTypeId: 1,
            documents: [{ uri: 'test', type: 'application/pdf' }],
            referrals: [],
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });

    const button = screen.getByType(Button);
    expect(button.props.disabled).toBeTruthy();
  });

  test('should validate there is no settlement advices', () => {
    const initialState = {
      claimType: {
        types: {
          byId: {
            1: {
              referralRequired: false,
            },
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            receiptAmount: '100',
            otherInsurerAmount: '50',
            claimTypeId: 1,
            documents: [{ uri: 'test', type: 'application/pdf' }],
            prescriptions: [{ uri: 'test', type: 'application/pdf' }],
            settlementAdvices: [],
            referrals: [],
            isMultiInsurer: true,
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });

    const button = screen.getByType(Button);
    expect(button.props.disabled).toBeTruthy();
  });

  test('should validate there is no prescriptions', () => {
    const initialState = {
      claimType: {
        types: {
          byId: {
            1: {
              code: 'NF-CHNHERBA',
              referralRequired: false,
            },
          },
        },
      },
      form: {
        claimDetailsForm: {
          values: {
            receiptAmount: '100',
            otherInsurerAmount: '50',
            claimTypeId: 1,
            documents: [{ uri: 'test', type: 'application/pdf' }],
            settlementAdvices: [{ uri: 'test', type: 'application/pdf' }],
            prescriptions: [],
            referrals: [],
            isMultiInsurer: true,
          },
        },
      },
    };
    const screen = renderForTest(<ClaimUploadDocumentsScreen />, {
      initialState,
    });

    const button = screen.getByType(Button);
    expect(button.props.disabled).toBeTruthy();
  });
});
