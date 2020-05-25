import * as types from './types';
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

/**
 * This is to prevent race condition where list fetched (without the specified properties) overwriting values that are already in the store
 * @param {object} claimsMap incoming claims
 * @param {object} existingClaimsMap claims in the store
 */
// Comment this block because it's never used
// function copyClaimItemCategoryReceiptsAndReferrals(
//   claimsMap,
//   existingClaimsMap,
// ) {
//   Object.keys(claimsMap).forEach(key => {
//     const existingClaim = existingClaimsMap[key];
//     if (existingClaim) {
//       claimsMap[key].claimItemCategory = existingClaim.claimItemCategory;
//       claimsMap[key].receipts = existingClaim.receipts;
//       claimsMap[key].referrals = existingClaim.referrals;
//     }
//   });
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SUBMIT_CLAIM_SUCCESS: {
      return {
        ...state,
        lastSubmittedClaim: action.payload,
      };
    }
    case types.GET_CLAIMS_START: {
      return {
        ...state,
        getClaimCompleted: PromiseStatus.START,
      };
    }
    case types.GET_CLAIMS_SUCCESS: {
      return {
        ...state,
        approved: {
          orderAll: action.payload.approved,
        },
        rejected: {
          orderAll: action.payload.rejected,
        },
        completed: {
          orderAll: action.payload.completed,
        },
        processing: {
          orderAll: action.payload.processing,
        },
        claimsMap: {
          ...state.claimsMap,
          ...action.payload.claimsMap,
        },
        getClaimCompleted: PromiseStatus.SUCCESS,
      };
    }
    case types.GET_CLAIMS_ERROR: {
      return {
        ...state,
        getClaimCompleted: PromiseStatus.ERROR,
      };
    }
    case types.GET_CLAIM_SUCCESS: {
      return {
        ...state,
        singleClaim: action.payload,
      };
    }
    case types.GET_CLAIM_FILTERS_SUCCESS: {
      // hardcode change claimCategoryFilters
      return {
        ...state,
        filters: {
          ...action.payload,
          claimCategoryFilters: [
            { code: 'outpatient', text: 'Outpatient' },
            { code: 'inpatient', text: 'Inpatient' },
            { code: 'dental', text: 'Dental' },
          ],
        },
      };
    }
    case types.UPDATE_CLAIM_FILTERS: {
      return {
        ...state,
        selectedClaimFilters: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
