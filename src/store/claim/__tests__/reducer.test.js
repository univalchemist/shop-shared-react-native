import reducer from '../reducer';
import * as types from '../types';
import { PromiseStatus } from '@middlewares';

const initialState = {
  processing: {
    orderAll: [],
  },
  approved: {
    orderAll: [],
  },
  rejected: {
    orderAll: [],
  },
  completed: {
    orderAll: [],
  },
  benefitPlanYear: null,
  singleClaim: {},
  claimsMap: {},
  filters: {},
  selectedClaimFilters: [],
  getClaimCompleted: PromiseStatus.START,
};

describe('Claim reducer', () => {
  it('should return the initialState', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle GET_CLAIMS_START', () => {
    const action = {
      type: types.GET_CLAIMS_START,
      payload: {},
    };
    const expectedState = {
      ...initialState,
      getClaimCompleted: PromiseStatus.START,
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle GET_CLAIM_SUCCESS', () => {
    const expectedResponseObject = {
      claimId: '31323061',
      clientId: 'cxadevclient1',
      memberId: null,
      claimantId: '192510',
      receiptDate: '2017-03-04T00:00:00',
      amount: 4450.0,
    };
    const action = {
      type: types.GET_CLAIM_SUCCESS,
      payload: expectedResponseObject,
    };
    const currentState = {
      ...initialState,
    };
    const expectedState = {
      ...initialState,
      singleClaim: { ...expectedResponseObject },
    };

    expect(reducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle GET_CLAIMS_SUCCESS', () => {
    const claimsMap = {
      6: {
        foo: 'baz',
      },
    };
    const expectedResponseObject = {
      approved: [],
      rejected: [],
      completed: [],
      processing: [],
      claimsMap,
    };
    const action = {
      type: types.GET_CLAIMS_SUCCESS,
      payload: expectedResponseObject,
    };
    const currentState = {
      ...initialState,
      claimsMap,
    };
    const expectedState = {
      ...initialState,
      approved: {
        orderAll: action.payload.approved,
      },
      rejected: {
        orderAll: action.payload.rejected,
      },
      processing: {
        orderAll: action.payload.processing,
      },
      claimsMap,
      getClaimCompleted: PromiseStatus.SUCCESS,
    };

    expect(reducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle GET_CLAIMS_ERROR', () => {
    const action = {
      type: types.GET_CLAIMS_ERROR,
      payload: {},
    };
    const expectedState = {
      ...initialState,
      getClaimCompleted: PromiseStatus.ERROR,
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_CLAIM_FILTERS', () => {
    const currentState = {
      ...initialState,
      selectedClaimFilters: [],
    };

    const filters = [
      'wellness',
      'PROCESSING',
      'REJECTED',
      'outpatient',
      'APPROVED',
      'William Brown',
    ];

    const action = {
      type: types.UPDATE_CLAIM_FILTERS,
      payload: filters,
    };

    const expectedState = {
      ...initialState,
      selectedClaimFilters: filters,
    };

    expect(reducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle SUBMIT_CLAIM_SUCCESS', () => {
    const currentState = {
      ...initialState,
      lastSubmittedClaim: null,
    };

    const submitClaimData = {
      data: {},
    };

    const action = {
      type: types.SUBMIT_CLAIM_SUCCESS,
      payload: submitClaimData,
    };

    const expectedState = {
      ...initialState,
      lastSubmittedClaim: submitClaimData,
    };

    expect(reducer(currentState, action)).toEqual(expectedState);
  });

  it('should handle GET_CLAIM_FILTERS_SUCCESS', () => {
    const currentState = {
      ...initialState,
      filters: null,
    };

    const claimFilterData = [
      'wellness',
      'PROCESSING',
      'REJECTED',
      'outpatient',
      'APPROVED',
      'William Brown',
    ];

    const action = {
      type: types.GET_CLAIM_FILTERS_SUCCESS,
      payload: claimFilterData,
    };

    const expectedState = {
      ...initialState,
      filters: {
        ...claimFilterData,
        claimCategoryFilters: [
          { code: 'outpatient', text: 'Outpatient' },
          { code: 'inpatient', text: 'Inpatient' },
          { code: 'dental', text: 'Dental' },
        ],
      },
    };

    expect(reducer(currentState, action)).toEqual(expectedState);
  });
});
