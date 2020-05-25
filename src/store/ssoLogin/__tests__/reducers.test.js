import reducer, { initialState } from '../reducer';
import * as types from '../types';

describe('ssoLogin reducer', () => {
  test('initiate state', () => {
    const initialStateObj = reducer(undefined, {});
    expect(initialStateObj).toEqual(initialState);
  });

  test('should update state when action UPDATE_SSO_LOGIN_STATE is dispatched', () => {
    const action = {
      type: types.UPDATE_SSO_LOGIN_STATE,
      payload: true,
    };
    const ssoLoginState = reducer(undefined, action);

    const expectedState = {
      ...initialState,
      ssoLoginState: action.payload,
    };

    expect(ssoLoginState).toEqual(expectedState);
  });

  test('should update state when action UPDATE_ACCOUNT_INFO is dispatched', () => {
    const action = {
      type: types.UPDATE_ACCOUNT_INFO,
      payload: {
        username: 'someusername',
        password: 'somepassword',
      },
    };
    const ssoLoginState = reducer(undefined, action);

    const expectedState = {
      ...initialState,
      accountInfo: action.payload,
    };

    expect(ssoLoginState).toEqual(expectedState);
  });
});
