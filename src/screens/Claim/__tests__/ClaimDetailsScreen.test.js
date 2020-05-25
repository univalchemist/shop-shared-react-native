import messages from '@messages/en-HK.json';
import { render } from '@testUtils';
import React from 'react';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { CLAIM_DETAILS_DOCUMENT_VIEWER_MODAL } from '@routes';
import { UploadBox, DocumentUploader } from '@wrappers/components';
import ClaimDetailsScreen from '../ClaimDetailsScreen';

const navigation = {
  navigate: jest.fn(),
};
const commonClaimData = {
  status: 'Pending',
  statusCode: 'PENDING',
  claimId: '184',
  createdOn: '2019-05-15T03:47:04.797Z',
  claimantId: '3',
  type: 'Specialist Consultation',
  receiptDate: '2019-05-14T03:47:04.797Z',
  amount: 800,
  category: 'Outpatient',
  reason: 'Sinusitis',
  contactNumber: '1111111',
  otherInsurerAmount: 20,
  documents: {
    receipts: [
      {
        id: 'receipt-id',
        contentType: 'image/jpeg',
        uri: 'http://download-receipt/receipt-id',
      },
    ],
    referrals: [
      {
        id: 'referral-id',
        contentType: 'application/pdf',
        uri: 'http://download-referral/referral-id',
      },
    ],
    settlementAdvices: [
      {
        id: 'referral-id',
        contentType: 'application/pdf',
        uri: 'http://download-referral/referral-id',
      },
    ],
    prescriptions: [
      {
        id: 'referral-id',
        contentType: 'application/pdf',
        uri: 'http://download-referral/referral-id',
      },
    ],
  },
};

const initialState = {
  claim: {
    claimsMap: {
      '184': commonClaimData,
    },
    pending: {
      orderAll: ['184'],
    },
    approvedRejected: {
      orderAll: [],
    },
    singleClaim: { amount: 800 },
  },
  user: {
    membersMap: {
      '3': {
        fullName: 'Dieter Ramsey Tan',
      },
    },
  },
};

const commonRoute = {
  params: {
    title: 'Claim Details',
    claimId: '184',
  },
};

jest.mock('react-native-config', () => {
  return {
    USE_CLAIM_SERVICE: 'true',
  };
});

describe('ClaimDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the claim item category', async () => {
    const [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState,
    });

    await flushMicrotasksQueue();
    expect(Component.getByText('Outpatient')).toBeDefined();
  });

  it('should render the receipt and referral images', async () => {
    const [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState,
    });

    await flushMicrotasksQueue();

    expect(Component.getAllByType(DocumentUploader).length).toEqual(4);
    expect(Component.getAllByType(UploadBox).length).toEqual(4);
    expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should navigate to the image view when receipt preview is pressed', async () => {
    const [Component] = render(
      <ClaimDetailsScreen navigation={navigation} route={commonRoute} />,
      {
        initialState,
      },
    );

    await flushMicrotasksQueue();
    act(() => {
      fireEvent(Component.getAllByType(UploadBox)[0], 'view');
    });

    expect(navigation.navigate).toHaveBeenCalledWith(
      CLAIM_DETAILS_DOCUMENT_VIEWER_MODAL,
      {
        id: 'receipt-id',
        contentType: 'image/jpeg',
        secure: true,
        uri: 'http://download-receipt/receipt-id',
      },
    );
  });
});

describe('ClaimDetails integration for request for information claim', () => {
  let Component;
  beforeAll(async () => {
    [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState: {
        ...initialState,
        claim: {
          ...initialState.claim,
          claimsMap: {
            '184': {
              ...commonClaimData,
              status: 'REQUEST FOR INFORMATION',
              statusCode: 'REQUEST FOR INFORMATION',
            },
          },
          singleClaim: {
            amount: 800,
          },
        },
      },
    });
    await flushMicrotasksQueue();
  });

  it('should display the Processing status header for requestion-for-information statuscode', () => {
    expect(Component.getByText('Processing')).toBeDefined();
  });

  const expectedSectionTitles = [
    'claim.section.patientDetails',
    'claim.section.claimDetails',
  ];

  test.each(expectedSectionTitles)('should display section title %s', title => {
    expect(Component.getByText(messages[title])).toBeDefined();
  });

  const expectedLabelsValues = [
    ['claim.label.patientName', 'Dieter Ramsey Tan'],
    ['claim.label.contactNumber', '1111111'],
    ['claim.label.claimType', 'Specialist Consultation'],
    ['claim.label.claimReason', 'Sinusitis'],
    ['claim.label.consultationDate', '14 May 2019'],
    ['claim.label.receiptAmount', 'HK$800.00'],
    ['claim.label.otherInsurerAmount', 'HK$20.00'],
  ];

  test.each(expectedLabelsValues)(
    'should display label %s with value %s',
    (label, value) => {
      expect(Component.getByText(messages[label])).toBeDefined();
      expect(Component.getByText(value)).toBeDefined();
    },
  );

  it('should match snapshot', () => {
    expect(Component.toJSON()).toMatchSnapshot();
  });
});

describe('ClaimDetails integration for pending claim', () => {
  let Component;
  beforeAll(async () => {
    [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState,
    });
    await flushMicrotasksQueue();
  });

  it('should display the Pending status header', () => {
    expect(Component.getByText('Pending')).toBeDefined();
  });

  const expectedSectionTitles = [
    'claim.section.patientDetails',
    'claim.section.claimDetails',
  ];

  test.each(expectedSectionTitles)('should display section title %s', title => {
    expect(Component.getByText(messages[title])).toBeDefined();
  });

  const expectedLabelsValues = [
    ['claim.label.patientName', 'Dieter Ramsey Tan'],
    ['claim.label.contactNumber', '1111111'],
    ['claim.label.claimType', 'Specialist Consultation'],
    ['claim.label.claimReason', 'Sinusitis'],
    ['claim.label.consultationDate', '14 May 2019'],
    ['claim.label.receiptAmount', 'HK$800.00'],
    ['claim.label.otherInsurerAmount', 'HK$20.00'],
  ];

  test.each(expectedLabelsValues)(
    'should display label %s with value %s',
    (label, value) => {
      expect(Component.getByText(messages[label])).toBeDefined();
      expect(Component.getByText(value)).toBeDefined();
    },
  );

  it('should match snapshot', () => {
    expect(Component.toJSON()).toMatchSnapshot();
  });
});

describe('ClaimDetails integration for approved cashless claim', () => {
  test.each([
    ['claim.label.totalReimbursedAmount', '-'],
    ['claim.label.receiptAmount', '-'],
    ['claim.label.settlementDate', '-'],
    ['claim.label.contactNumber', '123'],
  ])('should display label %s with value %s', async (label, value) => {
    const [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState: {
        claim: {
          claimsMap: {
            '184': {
              isCashlessClaim: true,
              status: 'Approved',
              statusCode: 'APPROVED',
              approvedAmount: 600,
              lastUpdatedOn: '2019-05-20T03:47:04.797Z',
              claimId: '184',
              createdOn: '2019-05-15T03:47:04.797Z',
              memberId: '3',
              claimantId: '3',
              type: 'Specialist Consultation',
              receiptDate: '2019-05-14T03:47:04.797Z',
              amount: 800,
              reason: 'Sinusitis',
              otherInsurerAmount: 20,
              contactNumber: '123',
              documents: {
                receipts: [],
                referrals: [],
                prescriptions: [],
                settlementAdvices: [],
              },
            },
          },
          pending: {
            orderAll: ['184'],
          },
          approvedRejected: {
            orderAll: [],
          },
          singleClaim: {
            amount: 800,
            isCashlessClaim: true,
            approvedAmount: 900,
            lastUpdatedOn: '2019-05-20T03:47:04.797Z',
          },
        },
        user: initialState.user,
      },
    });
    await flushMicrotasksQueue();
    expect(Component.getByText(messages[label])).toBeDefined();
    expect(Component.getAllByText(value)).toBeDefined();
  });
});

describe('ClaimDetails integration for approved claim', () => {
  let Component;
  beforeAll(async () => {
    [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState: {
        claim: {
          claimsMap: {
            '184': {
              status: 'Approved',
              statusCode: 'APPROVED',
              approvedAmount: 600,
              lastUpdatedOn: '2019-05-20T03:47:04.797Z',
              claimId: '184',
              createdOn: '2019-05-15T03:47:04.797Z',
              memberId: '3',
              claimantId: '3',
              type: 'Specialist Consultation',
              receiptDate: '2019-05-14T03:47:04.797Z',
              amount: 800,
              reason: 'Sinusitis',
              otherInsurerAmount: 20,
              contactNumber: null,
              documents: {
                receipts: [],
                referrals: [],
                prescriptions: [],
                settlementAdvices: [],
              },
              paymentList: [
                {
                  benefitDescEng: 'BONESETTER/HERBALIST/ ACUPUNCTURE',
                  benefitDescSch: '跌打 / 中醫 / 針灸,',
                  reimbursedAmount: 180,
                  reimbursedCurrency: 'HK$',
                },
                {
                  benefitDescEng: 'CHILDBIRTH',
                  benefitDescSch: '產科,',
                  reimbursedAmount: 80,
                  reimbursedCurrency: 'HK$',
                },
              ],
            },
          },
          pending: {
            orderAll: ['184'],
          },
          approvedRejected: {
            orderAll: [],
          },
          singleClaim: {
            amount: 800,
            approvedAmount: 900,
            lastUpdatedOn: '2019-05-20T03:47:04.797Z',
          },
        },
        user: initialState.user,
      },
    });
  });

  it('should display the Approved status header', () => {
    expect(
      Component.getByText(messages['claim.header.Approved']),
    ).toBeDefined();
  });

  const expectedLabelsValues = [
    ['claim.label.totalReimbursedAmount', 'HK$900.00'],
    ['claim.label.receiptAmount', 'HK$800.00'],
    ['claim.label.settlementDate', '20 May 2019'],
    ['claim.label.contactNumber', '-'],
  ];

  test.each(expectedLabelsValues)(
    'should display label %s with value %s',
    (label, value) => {
      expect(Component.getByText(messages[label])).toBeDefined();
      expect(Component.getByText(value)).toBeDefined();
    },
  );

  it('should match snapshot', () => {
    expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should display show English benefit value when have no Chinese benefit value', () => {
    const [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState: {
        claim: {
          claimsMap: {
            '184': {
              status: 'Approved',
              statusCode: 'APPROVED',
              approvedAmount: 600,
              lastUpdatedOn: '2019-05-20T03:47:04.797Z',
              claimId: '184',
              createdOn: '2019-05-15T03:47:04.797Z',
              memberId: '3',
              claimantId: '3',
              type: 'Specialist Consultation',
              receiptDate: '2019-05-14T03:47:04.797Z',
              amount: 800,
              reason: 'Sinusitis',
              otherInsurerAmount: 20,
              contactNumber: null,
              documents: {
                receipts: [],
                referrals: [],
                prescriptions: [],
                settlementAdvices: [],
              },
            },
          },
          pending: {
            orderAll: ['184'],
          },
          approvedRejected: {
            orderAll: [],
          },
          singleClaim: {
            amount: 800,
            approvedAmount: 900,
            lastUpdatedOn: '2019-05-20T03:47:04.797Z',
            paymentList: [
              {
                benefitDescEng: 'BONESETTER/HERBALIST/ ACUPUNCTURE',
                benefitDescSch: '',
                reimbursedAmount: 180,
                reimbursedCurrency: 'HK$',
              },
              {
                benefitDescEng: 'CHILDBIRTH',
                benefitDescSch: null,
                reimbursedAmount: 80,
                reimbursedCurrency: 'HK$',
              },
            ],
          },
        },
        user: initialState.user,
      },
    });

    expect(Component.toJSON()).toMatchSnapshot();
  });
});

describe('ClaimDetails integration for rejected claim', () => {
  let Component;
  beforeAll(async () => {
    [Component] = render(<ClaimDetailsScreen route={commonRoute} />, {
      initialState: {
        claim: {
          claimsMap: {
            '184': {
              status: 'Rejected',
              statusCode: 'REJECTED',
              lastUpdatedOn: '2019-05-21T03:47:04.797Z',
              claimId: '184',
              createdOn: '2019-05-15T03:47:04.797Z',
              memberId: '3',
              claimantId: '3',
              claimantName: 'Dieter Ramsey Tan',
              type: 'Specialist Consultation',
              receiptDate: '2019-05-14T03:47:04.797Z',
              amount: 800,
              reason: 'Sinusitis',
              otherInsurerAmount: 20,
              documents: {
                receipts: [],
                referrals: [],
                prescriptions: [],
                settlementAdvices: [],
              },
            },
          },
          pending: {
            orderAll: ['184'],
          },
          approvedRejected: {
            orderAll: [],
          },
          singleClaim: {
            amount: 800,
            approvedAmount: 900,
            lastUpdatedOn: '2019-05-21T03:47:04.797Z',
          },
        },
        user: initialState.user,
      },
    });
  });

  it('should display the Rejected status header', () => {
    expect(
      Component.getByText(messages['claim.header.Rejected']),
    ).toBeDefined();
  });

  const expectedLabelsValues = [
    ['claim.label.receiptAmount', 'HK$800.00'],
    ['claim.label.settlementDate', '21 May 2019'],
  ];

  test.each(expectedLabelsValues)(
    'should display label %s with value %s',
    (label, value) => {
      expect(Component.getByText(messages[label])).toBeDefined();
      expect(Component.getByText(value)).toBeDefined();
    },
  );

  it('should not render the payment amount', () => {
    expect(
      Component.queryByText(messages['claim.label.totalReimbursedAmount']),
    ).toBeNull();
  });

  it('should match snapshot', () => {
    expect(Component.toJSON()).toMatchSnapshot();
  });
});
