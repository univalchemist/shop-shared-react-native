import * as types from './types';

export const updateSSOLoginState = status => ({
  type: types.UPDATE_SSO_LOGIN_STATE,
  payload: status,
});

export const updateAccountInfo = accountInfo => ({
  type: types.UPDATE_ACCOUNT_INFO,
  payload: accountInfo,
});
