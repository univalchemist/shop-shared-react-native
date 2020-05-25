import React from 'react';
import { renderForTest } from '@testUtils';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import ClaimTermsConditionsModal from '../ClaimTermsConditionsModal';
import { CLAIMS_LIST, CLAIM_SUCCESS_MODAL, CLAIM_ERROR_MODAL } from '@routes';
import messages from '@messages/en-HK.json';
import originalNavigation from '@testUtils/__mocks__/navigation';

const navigation = {
  ...originalNavigation,
  dangerouslyGetState: jest.fn().mockImplementation(() => ({
    routes: [
      {
        routeName: CLAIMS_LIST,
      },
    ],
  })),
};

const api = {
  uploadDocumentReference: jest.fn().mockImplementation(() => ({
    data: {
      documentId: 'document-id',
    },
  })),
  submitClaim: jest.fn().mockImplementation(() => ({
    data: {
      claimId: 'claim-id',
    },
  })),
};

const initialState = {
  claimType: {
    categories: {
      all: [1],
      byId: {
        1: {
          claimCategory: 'Outpatient',
          claimTypeIds: [1],
          code: 'outpatient',
          displayOrder: 1,
          id: 1,
          isInsuranceClaim: true,
        },
      },
    },
    reasons: {
      byId: {
        1: { claimReason: 'Abdominal Colic', code: 'COLIC', id: 1 },
      },
    },
    types: {
      byId: {
        1: {
          claimCategoryId: 1,
          claimReasons: [1],
          claimType: 'General practitioner',
          code: 'MO-GP',
          id: 1,
          isInsuranceClaim: true,
          maxAmountPerClaim: 800,
          referralRequired: false,
        },
      },
    },
  },
};

describe('ClaimTermsConditionsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.skip('should render correctly', () => {
    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState,
        api,
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it.skip('should render loading screen', () => {
    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState: {
          form: { claimDetailsForm: { submitting: true } },
          ...initialState,
        },
        api,
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should navigate to CLAIM_REVIEW on uploadDocumentReference type:Receipt error', async () => {
    api.uploadDocumentReference.mockImplementationOnce(() => {
      const error = {
        response: { data: { message: 'foo' } },
      };
      throw error;
    });

    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState: {
          form: {
            claimDetailsForm: {
              values: {
                documents: [{ uri: 'some-receipt' }],
                referrals: [],
                claimTypeId: 1,
                claimReason: 1,
              },
            },
          },
          ...initialState,
        },
        api,
      },
    );

    const button = component.getByProps({
      title: messages['claim.acceptClaimTermsConditions'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_ERROR_MODAL);
  });

  it('should navigate to CLAIM_REVIEW on uploadDocumentReference type:Referral error', async () => {
    api.uploadDocumentReference
      .mockImplementationOnce(() => ({
        // Mock for type Receipt
        data: {
          documentId: 'document-id',
        },
      }))
      .mockImplementationOnce(() => {
        // Mock for type Referral
        const error = {
          response: { data: { message: 'foo' } },
        };
        throw error;
      });

    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState: {
          form: {
            claimDetailsForm: {
              values: {
                claimTypeId: 1,
                claimReason: 1,
                documents: [{ uri: 'some receipt' }],
                referrals: [
                  {
                    uri: 'some referral',
                  },
                ],
              },
            },
          },
          ...initialState,
        },
        api,
      },
    );

    const button = component.getByProps({
      title: messages['claim.acceptClaimTermsConditions'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_ERROR_MODAL);
  });

  it('should navigate to CLAIM_REVIEW on submitClaim error', async () => {
    api.submitClaim.mockImplementationOnce(values => {
      const error = {
        response: { data: { message: 'foo' } },
      };
      throw error;
    });

    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState: {
          form: {
            claimDetailsForm: {
              values: {
                claimTypeId: 1,
                claimReason: 1,
                claimantId: 'Born to fail',
                documents: [],
                referrals: [],
              },
            },
          },
          ...initialState,
        },
        api,
      },
    );
    const button = component.getByProps({
      title: messages['claim.acceptClaimTermsConditions'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(api.submitClaim).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_ERROR_MODAL);
  });

  it('should navigate to CLAIM_SUCCESS_MODAL on success', async () => {
    const component = renderForTest(
      <ClaimTermsConditionsModal navigation={navigation} />,
      {
        initialState: {
          ...initialState,
          claim: { isSubmitting: false },
          form: {
            claimDetailsForm: {
              values: {
                claimTypeId: 1,
                claimantId: '3',
                claimReason: 1,
                documents: [{ uri: 'receipt1' }],
                referrals: [{ uri: 'referral1' }],
              },
            },
          },
        },
        api,
      },
    );
    const button = component.getByProps({
      title: messages['claim.acceptClaimTermsConditions'],
    });

    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();
    expect(navigation.reset).toHaveBeenCalledWith({
      routes: [
        { name: 'ClaimsList' },
        { name: 'ClaimSuccessModal', params: { claimId: 'claim-id' } },
      ],
    });
    expect(api.uploadDocumentReference).toHaveBeenCalledTimes(2);
    expect(api.uploadDocumentReference).toHaveBeenCalledWith(
      undefined,
      undefined,
      'Receipt',
      {
        uri: 'receipt1',
      },
    );
    expect(api.uploadDocumentReference).toHaveBeenCalledWith(
      undefined,
      undefined,
      'Referral',
      {
        uri: 'referral1',
      },
    );
  });
});
