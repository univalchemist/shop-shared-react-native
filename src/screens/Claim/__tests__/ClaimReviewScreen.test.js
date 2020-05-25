import { renderForTest } from '@testUtils';
import React from 'react';
import ClaimReviewScreen from '../ClaimReviewScreen';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import {
  CLAIM_TERMS_CONDITIONS_MODAL,
  CLAIM_DOCUMENT_VIEWER_MODAL,
} from '@routes';
import messages from '@messages/en-HK.json';

const claimType = {
  categories: {
    all: [10, 20],
    byId: {
      10: {
        id: 10,
        code: 'Outpatient',
        claimCategory: 'Outpatient',
        claimTypeIds: [1],
      },
      20: {
        id: 20,
        code: 'Wellness',
        claimCategory: 'Wellness',
        claimTypeIds: [2],
      },
    },
  },
  types: {
    byId: {
      1: {
        id: 1,
        code: 'MO-GP',
        claimType: 'General practitioner',
        claimCategoryId: 10,
        claimReasonIds: [100],
        isInsuranceClaim: true,
      },
      2: {
        id: 2,
        code: 'PHYSIO',
        claimType: 'Physiotherapy',
        claimCategoryId: 20,
        claimReasonIds: [200],
        isInsuranceClaim: false,
      },
    },
  },
  reasons: {
    byId: {
      100: {
        id: 100,
        code: 'COLIC',
        claimReason: 'Abdominal Colic',
      },
      200: {
        id: 200,
        code: 'PHYSIO',
        claimReason: 'Physiotherapy',
      },
    },
  },
};

describe('ClaimReviewScreen', () => {
  const form = {
    claimDetailsForm: {
      fields: { D: {} },
      values: {
        receiptAmount: '100',
        otherInsurerAmount: '50',
        claimTypeId: 1,
        claimReason: 100,
      },
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render claim review screen', () => {
    const initialState = {
      form,
      claimType,
    };
    renderForTest(<ClaimReviewScreen />, { initialState });
  });

  it('navigate to terms and condition modal on submit', async () => {
    const initialState = {
      form,
      claimType,
    };
    const navigation = { navigate: jest.fn() };
    const { getByProps } = renderForTest(
      <ClaimReviewScreen navigation={navigation} />,
      { initialState },
    );
    const button = getByProps({
      title: messages['claim.submitClaimButtonText'],
    });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_TERMS_CONDITIONS_MODAL,
    );
  });

  it('should navigate to viewer modal when receipt thumbnail is pressed on', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            ...form.claimDetailsForm.values,
            documents: [{ uri: 'test', type: 'application/pdf' }],
          },
        },
      },
      claimType,
    };
    const navigation = { navigate: jest.fn() };
    const { getByText, getByProps } = renderForTest(
      <ClaimReviewScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();

    const thumbnail = getByProps({
      accessibilityLabel: 'View document of Receipts',
    });
    await fireEvent.press(thumbnail);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_DOCUMENT_VIEWER_MODAL,
      {
        contentType: 'application/pdf',
        uri: 'test',
      },
    );

    const title = getByText(messages['claim.section.receipts']);
    expect(title).toBeDefined();
  });

  it('should display the referral section when referrals have been added', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            ...form.claimDetailsForm.values,
            referrals: [{ uri: 'test', type: 'application/pdf' }],
          },
        },
      },
      claimType,
    };
    const navigation = { navigate: jest.fn() };
    const { getByText, getByProps } = renderForTest(
      <ClaimReviewScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const thumbnail = getByProps({
      accessibilityLabel: 'View document of Referral letter',
    });
    await fireEvent.press(thumbnail);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_DOCUMENT_VIEWER_MODAL,
      {
        contentType: 'application/pdf',
        uri: 'test',
      },
    );

    const title = getByText(messages['claim.section.referrals']);
    expect(title).toBeDefined();
  });

  test('should display the settlement advice section when settlement advices have been added', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            ...form.claimDetailsForm.values,
            settlementAdvices: [{ uri: 'test', type: 'application/pdf' }],
          },
        },
      },
      claimType,
    };
    const navigation = { navigate: jest.fn() };
    const { getByText, getByProps } = renderForTest(
      <ClaimReviewScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const thumbnail = getByProps({
      accessibilityLabel: 'View document of Settlement Advice',
    });
    await fireEvent.press(thumbnail);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_DOCUMENT_VIEWER_MODAL,
      {
        contentType: 'application/pdf',
        uri: 'test',
      },
    );

    const title = getByText(messages['claim.section.settlementAdvices']);
    expect(title).toBeDefined();
  });

  test('should display the prescription section when prescriptions have been added', async () => {
    const initialState = {
      form: {
        claimDetailsForm: {
          values: {
            ...form.claimDetailsForm.values,
            prescriptions: [{ uri: 'test', type: 'application/pdf' }],
          },
        },
      },
      claimType,
    };
    const navigation = { navigate: jest.fn() };
    const { getByText, getByProps } = renderForTest(
      <ClaimReviewScreen navigation={navigation} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const thumbnail = getByProps({
      accessibilityLabel:
        'View document of Prescription / Supporting Documents',
    });
    await fireEvent.press(thumbnail);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_DOCUMENT_VIEWER_MODAL,
      {
        contentType: 'application/pdf',
        uri: 'test',
      },
    );

    const title = getByText(messages['claim.section.prescriptions']);
    expect(title).toBeDefined();
  });

  it('should not display the referral section when referrals have not been added', () => {
    const initialState = {
      form,
      claimType,
    };
    const { queryByText } = renderForTest(<ClaimReviewScreen />, {
      initialState,
    });
    const query = queryByText(messages['claim.section.referrals']);
    expect(query).toBeNull();
  });

  it('should not display other insurer amount and change label to claim amount when claimTypeId is wellness', () => {
    const form = {
      claimDetailsForm: {
        fields: { D: {} },
        values: {
          receiptAmount: '100',
          otherInsurerAmount: '50',
          claimTypeId: 2,
          claimReason: 200,
        },
      },
    };
    const initialState = {
      form,
      claimType,
    };
    const { queryByText } = renderForTest(<ClaimReviewScreen />, {
      initialState,
    });
    expect(queryByText(messages['claim.label.claimAmount'])).toBeDefined();
    expect(queryByText(messages['claim.label.otherInsurerAmount'])).toBeNull();
  });
});
