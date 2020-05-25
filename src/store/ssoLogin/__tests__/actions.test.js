import * as types from '../types';
import * as actions from '../actions';
import { configureMockStore } from '@testUtils';

describe('ssoLogin actions', () => {
  test('should return an action when update ssoLogin login status', () => {
    const store = configureMockStore()();
    store.dispatch(actions.updateSSOLoginState(true));
    expect(store.getActions()).toEqual([
      {
        type: types.UPDATE_SSO_LOGIN_STATE,
        payload: true,
      },
    ]);
  });

  test('should return an action when update hiDoc ssoLogin account info', () => {
    const store = configureMockStore()();
    store.dispatch(
      actions.updateAccountInfo({
        username: 'someusername',
        password: 'somepassword',
      }),
    );
    expect(store.getActions()).toEqual([
      {
        type: types.UPDATE_ACCOUNT_INFO,
        payload: {
          username: 'someusername',
          password: 'somepassword',
        },
      },
    ]);
  });
});
