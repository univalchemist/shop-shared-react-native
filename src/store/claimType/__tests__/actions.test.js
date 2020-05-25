import * as actions from '../actions';
import * as types from '../types';
import { configureMockStore } from '@testUtils';

const api = {
  getClaimTypes: () => ({
    data: [
      {
        id: 1,
        code: 'outpatient',
        claimCategory: 'Outpatient',
        isInsuranceClaim: true,
        displayOrder: 1,
        claimTypes: [
          {
            id: 10,
            code: 'MO-GP',
            maxAmountPerClaim: 800.0,
            referralRequired: false,
            claimType: 'General practitioner',
            claimCategoryId: 1,
            claimReasons: [
              {
                id: 100,
                code: 'COLIC',
                claimReason: 'Abdominal Colic',
              },
            ],
          },
        ],
      },
    ],
  }),
};

describe('ConsultationType actions', () => {
  test('should create an action to fetch claim items', () => {
    const store = configureMockStore(api)();
    const expectedActions = [
      { type: types.FETCH_CLAIM_TYPES_START },
      {
        type: types.FETCH_CLAIM_TYPES_SUCCESS,
        payload: {
          categories: {
            all: [1],
            byId: {
              1: {
                id: 1,
                code: 'outpatient',
                claimCategory: 'Outpatient',
                isInsuranceClaim: true,
                displayOrder: 1,
                claimTypeIds: [10],
              },
            },
          },
          types: {
            byId: {
              10: {
                id: 10,
                code: 'MO-GP',
                maxAmountPerClaim: 800.0,
                referralRequired: false,
                claimType: 'General practitioner',
                claimCategoryId: 1,
                claimReasonIds: [100],
                isInsuranceClaim: true,
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
            },
          },
        },
      },
    ];
    return store.dispatch(actions.fetchClaimTypes()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
