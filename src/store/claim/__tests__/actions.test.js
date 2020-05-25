import { change } from 'redux-form';
import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

jest.mock('moment', () =>
  jest.fn(() => ({
    format: () => '2019-04-01T00:00:00',
  })),
);

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({
    type: 'test',
  })),
}));

const api = {
  submitClaim: () => ({}),
  getClaim: () => ({
    data: {
      claimId: '31323061',
      clientId: 'cxadevclient1',
      memberId: null,
      claimantId: '192510',
      receiptDate: '2017-03-04T00:00:00',
      amount: 4450.0,
    },
  }),
  getClaims: () => ({
    data: [
      {
        claimId: '6',
        statusCode: 'PROCESSING',
        documents: {
          receipts: [
            {
              id: 'receipt-id',
              contentType: 'application/pdf',
            },
          ],
          referrals: [],
        },
      },
      {
        claimId: '7',
        statusCode: 'APPROVED',
      },
      {
        claimId: '8',
        statusCode: 'REJECTED',
        documents: {
          receipts: [],
          referrals: [],
        },
      },
      {
        claimId: '9',
        statusCode: 'REQUEST FOR INFORMATION',
        documents: {
          receipts: [
            {
              id: 'receipt-id',
              contentType: 'application/pdf',
            },
          ],
          referrals: [],
        },
      },
    ],
  }),
  uploadDocumentReference: () => ({ data: { documentId: '32' } }),
  getClaimFilters: () => ({
    data: {
      claimCategoryFilters: [
        {
          code: 'outpatient',
          text: 'Outpatient',
        },
        {
          code: 'wellness',
          text: 'Wellness',
        },
      ],
      claimStatusFilters: [
        {
          code: 'PROCESSING',
          text: 'Processing',
        },
        {
          code: 'APPROVED',
          text: 'Approved',
        },
        {
          code: 'REJECTED',
          text: 'Rejected',
        },
      ],
    },
  }),
};

const claimType = {
  categories: {
    all: [10, 20],
    byId: {
      10: {
        id: 10,
        code: 'outpatient',
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
        maxAmountPerClaim: 100,
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

describe('transformClaimSubmit', () => {
  const formValues = {
    patientName: 'William Brown',
    contactNumber: '81238789',
    selectedPatientId: 3,
    claimTypeId: 1,
    claimType: 'General practitioner',
    claimReason: 100,
    consultationDate: '2019-03-31T16:00:00.000Z',
    receiptAmount: '200',
    isMultiInsurer: true,
    otherInsurerAmount: '100',
    documents: [
      {
        fileSize: 6581432,
        fileName: 'IMG_0003.JPG',
        uri: 'file:///example_filename.jpg',
        timestamp: '2012-08-08T18:52:11Z',
        width: 3000,
        longitude: -17.548928333333333,
        latitude: 65.682895,
        type: 'image/jpeg',
        origURL:
          'assets-library://asset/asset.JPG?id=9F983DBA-EC35-42B8-8773-B597CF782EDD&ext=JPG',
        data: '<someimagedata>',
        height: 2002,
        isVertical: false,
      },
    ],
    receiptFilesIds: ['1556775295'],
    referralFilesIds: ['1234567890'],
  };
  const expected = {
    claimantId: 3,
    categoryCode: 'outpatient',
    reasonCode: 'COLIC',
    typeCode: 'MO-GP',
    amount: '200',
    acceptTermsAndConditions: true,
    contactNumber: '81238789',
    receiptDate: '2019-04-01T00:00:00',
    isMaternity: false,
    otherInsurerAmount: '100',
    documents: {
      receipts: ['1556775295'],
      referrals: ['1234567890'],
    },
  };

  it('transforms the payload correctly', () => {
    expect(actions.transformClaimSubmit(formValues, claimType)).toEqual(
      expected,
    );
  });
});

describe('submitClaim', () => {
  test('should create actions to submit claim', async () => {
    const store = configureMockStore(api)({
      claimType,
      member: { selectedId: 3, employee: { employeeKey: 3 } },
    });
    const values = {
      consultationDate: '23, April 2019',
      claimTypeId: 1,
      claimReason: 100,
    };
    const expectedActions = [
      { type: types.SUBMIT_CLAIM_START },
      {
        type: types.SUBMIT_CLAIM_SUCCESS,
      },
    ];

    await store.dispatch(actions.submitClaim(values));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('getClaim', () => {
  test('should create action to get claim', async () => {
    const store = configureMockStore(api)({
      claim: { selectedClaimFilters: [], claimsMap: {} },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });
    const expectedActions = [
      { type: types.GET_CLAIM_START },
      {
        type: types.GET_CLAIM_SUCCESS,
        payload: {
          claimId: '31323061',
          clientId: 'cxadevclient1',
          memberId: null,
          claimantId: '192510',
          receiptDate: '2017-03-04T00:00:00',
          amount: 4450.0,
        },
      },
    ];
    await store.dispatch(actions.getClaim());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Fetch claims data for claim list screen', () => {
  test('should create action to get claims', async () => {
    const store = configureMockStore(api)({
      claim: { selectedClaimFilters: [], claimsMap: {} },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });
    const expectedActions = [
      { type: types.GET_CLAIMS_START },
      {
        type: types.GET_CLAIMS_SUCCESS,
        payload: {
          claimsMap: {
            '6': {
              claimId: '6',
              statusCode: 'PROCESSING',
              documents: {
                receipts: [
                  {
                    id: 'receipt-id',
                    contentType: 'application/pdf',
                    uri:
                      'https://microservices.localhost/claim/api/v1/clients/clientId/users/userId/claim/documents/receipt-id',
                  },
                ],
                referrals: [],
              },
            },
            '7': {
              claimId: '7',
              statusCode: 'APPROVED',
              documents: {
                receipts: [],
                referrals: [],
              },
            },
            '8': {
              claimId: '8',
              statusCode: 'REJECTED',
              documents: {
                receipts: [],
                referrals: [],
              },
            },
            '9': {
              claimId: '9',
              statusCode: 'REQUEST FOR INFORMATION',
              documents: {
                receipts: [
                  {
                    id: 'receipt-id',
                    contentType: 'application/pdf',
                    uri:
                      'https://microservices.localhost/claim/api/v1/clients/clientId/users/userId/claim/documents/receipt-id',
                  },
                ],
                referrals: [],
              },
            },
          },
          processing: ['6', '9'],
          completed: ['7', '8'],
          approved: ['7'],
          rejected: ['8'],
        },
      },
    ];
    await store.dispatch(actions.getClaims());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('uploadDocumentsForReference', () => {
  test('should create actions to upload documents reference', async () => {
    const store = configureMockStore(api)({});

    const expectedActions = [
      {
        type: types.UPLOAD_DOCUMENTS_FOR_REFERENCE_START,
      },
      {
        type: 'test',
      },
      {
        type: types.UPLOAD_DOCUMENTS_FOR_REFERENCE_SUCCESS,
        payload: ['32'],
      },
    ];

    await store.dispatch(
      actions.uploadDocumentsForReference('Receipt', [
        {
          uri: 'someuri',
          fileName: 'fileName',
          type: 'image',
        },
      ]),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('should throw error when API fails', async () => {
    const api = {
      uploadDocumentReference: () =>
        Promise.reject(new Error('You have failed the city')),
    };

    const store = configureMockStore(api)({});
    try {
      await store.dispatch(
        actions.uploadDocumentsForReference('Receipt', [
          {
            uri: 'someuri',
            fileName: 'fileName',
            type: 'image',
          },
        ]),
      );
    } catch {}

    const lastAction = store.getActions().pop();
    expect(lastAction).toEqual({
      error: true,
      type: types.UPLOAD_DOCUMENTS_FOR_REFERENCE_ERROR,
      payload: Error('You have failed the city'),
    });
  });

  test('should call correct api for claim receipt upload', async () => {
    const api = {
      uploadDocumentReference: jest.fn(() => ({
        data: { documentId: '32' },
      })),
    };

    const store = configureMockStore(api)({
      user: {
        clientId: 'foo',
        userId: 'bar',
      },
    });
    const docs = [
      {
        uri: 'someuri',
        fileName: 'fileName',
        type: 'image',
      },
    ];
    await store.dispatch(actions.uploadDocumentsForReference('Receipt', docs));

    expect(api.uploadDocumentReference).toHaveBeenCalledWith(
      'foo',
      'bar',
      'Receipt',
      docs[0],
    );
    expect(change).toHaveBeenCalledWith('claimDetailsForm', 'receiptFilesIds', [
      '32',
    ]);
  });

  test('should call correct api for claim referral upload', async () => {
    const api = {
      uploadDocumentReference: jest.fn(() => ({
        data: { documentId: '32' },
      })),
    };

    const store = configureMockStore(api)({
      user: {
        clientId: 'foo',
        userId: 'bar',
      },
    });
    const docs = [
      {
        uri: 'someuri',
        fileName: 'fileName',
        type: 'image',
      },
    ];
    await store.dispatch(actions.uploadDocumentsForReference('Referral', docs));

    expect(api.uploadDocumentReference).toHaveBeenCalledWith(
      'foo',
      'bar',
      'Referral',
      docs[0],
    );
    expect(change).toHaveBeenCalledWith(
      'claimDetailsForm',
      'referralFilesIds',
      ['32'],
    );
  });
});

describe('GetClaimFilters', () => {
  test('should create action to get claim filters', async () => {
    const store = configureMockStore(api)({
      claim: { filters: {} },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });

    const expectedActions = [
      { type: types.GET_CLAIM_FILTERS_START },
      {
        type: types.GET_CLAIM_FILTERS_SUCCESS,
        payload: {
          claimCategoryFilters: [
            {
              code: 'outpatient',
              text: 'Outpatient',
            },
            {
              code: 'wellness',
              text: 'Wellness',
            },
          ],
          claimStatusFilters: [
            {
              code: 'PROCESSING',
              text: 'Processing',
            },
            {
              code: 'APPROVED',
              text: 'Approved',
            },
            {
              code: 'REJECTED',
              text: 'Rejected',
            },
          ],
        },
      },
    ];
    await store.dispatch(actions.getClaimFilters());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updateClaimFilters', () => {
  it('should update claim filters', async () => {
    const store = configureMockStore(api)({
      claim: { filters: {} },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });

    const expectedActions = [{ type: types.UPDATE_CLAIM_FILTERS }];

    await store.dispatch(actions.updateClaimFilters());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('call getClaims api by filters', () => {
  const filterClaimsapi = {
    getClaims: jest.fn(() => ({
      data: [
        {
          claimId: '6',
          statusCode: 'PROCESSING',
          documents: {
            receipts: [
              {
                id: 'receipt-id',
                contentType: 'application/pdf',
              },
            ],
            referrals: [],
          },
        },
        {
          claimId: '7',
          statusCode: 'APPROVED',
        },
        {
          claimId: '8',
          statusCode: 'REJECTED',
          documents: {
            receipts: [],
            referrals: [],
          },
        },
        {
          claimId: '9',
          statusCode: 'REQUEST FOR INFORMATION',
          documents: {
            receipts: [
              {
                id: 'receipt-id',
                contentType: 'application/pdf',
              },
            ],
            referrals: [],
          },
        },
      ],
    })),
  };
  it('should call getClaims with filter REQUEST FOR INFORMATION if PROCESSING selected', async () => {
    const store = configureMockStore(filterClaimsapi)({
      claim: {
        selectedClaimFilters: [
          { type: 'claimStatusFilters', value: 'PROCESSING' },
        ],
        claimsMap: {},
      },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });
    await store.dispatch(actions.getClaims());
    expect(filterClaimsapi.getClaims).toHaveBeenCalledWith(
      'clientId',
      'userId',
      'statuses=PROCESSING,REQUEST FOR INFORMATION',
    );
  });

  it('should call getClaims without filter REQUEST FOR INFORMATION if PROCESSING not selected', async () => {
    const store = configureMockStore(filterClaimsapi)({
      claim: {
        selectedClaimFilters: [
          { type: 'claimStatusFilters', value: 'REJECTED' },
        ],
        claimsMap: {},
      },
      user: {
        clientId: 'clientId',
        userId: 'userId',
      },
    });
    await store.dispatch(actions.getClaims());
    expect(filterClaimsapi.getClaims).toHaveBeenCalledWith(
      'clientId',
      'userId',
      'statuses=REJECTED',
    );
  });
});
