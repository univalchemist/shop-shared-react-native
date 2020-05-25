import * as types from './types';

const initialState = {
  termsAndConditions: null,
  privacyPolicy: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_TERMS_CONDITIONS_SUCCESS: {
      return {
        ...state,
        termsAndConditions: action.payload,
      };
    }
    case types.FETCH_PRIVACY_POLICY_SUCCESS: {
      return {
        ...state,
        privacyPolicy: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
