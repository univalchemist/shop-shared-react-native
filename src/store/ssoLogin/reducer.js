import * as types from './types';

export const initialState = {
  ssoLoginState: false,
  accountInfo: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SSO_LOGIN_STATE:
      return {
        ...state,
        ssoLoginState: action.payload,
      };
    case types.UPDATE_ACCOUNT_INFO:
      return {
        ...state,
        accountInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
