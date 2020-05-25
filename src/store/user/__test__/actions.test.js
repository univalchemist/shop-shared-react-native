import { configureMockStore } from '@testUtils';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import * as actions from '../actions';
import * as types from '../types';
import * as secureStore from '@services/secureStore';
import { SET_LOCALE } from '../../intl/types';
import { CLEAR_PANEL_CLINICS } from '../../panel/types';
import localeMessages_en from '@messages/en-HK.json';
import heal_en_messages from '@heal/messages/en-HK';
import localeMessages_zh from '@messages/zh-HK.json';
import heal_zh_messages from '@heal/messages/zh-HK';
import { en_HK as shop_en_messages } from '@components/shops';
import { zh_HK as shop_zh_messages } from '@components/shops';

import { Storage } from '@utils';

jest.mock('@services/secureStore', () => ({
  saveTokens: jest.fn(),
  saveCredentials: jest.fn(),
}));

jest.mock('@utils', () => {
  return {
    ...require.requireActual('@utils'),
  };
});

const loginResponse = {
  access_token: 'myaccesstoken',
  id_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHw0NDMiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjN9.UEFt5X-Gp-Lu0f_X3d7T5iOKkRSF09LctQivd8WrBf4',
  scope: 'openid profile email address phone',
  expires_in: 86400,
  token_type: 'Bearer',
};

const memberProfileResponse = {
  role: 'Employee',
  preferredLocale: 'en-HK',
};

const mockApi = {
  login: () => ({
    data: loginResponse,
  }),
  fetchMemberProfile: () => ({
    data: memberProfileResponse,
  }),
  updateMemberProfile: memberProfile => ({
    status: 200,
  }),
  forgotPassword: jest.fn(() => ({ status: 200 })),
  updateDependentDoB: member => {},
  sendInvitationToDependent: dependentEmail => {},
};

const after = jest.fn();

const getStore = (api = {}, state = {}) =>
  configureMockStore({ ...mockApi, ...api })(state);

describe('Login tests with valid id tokens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should create an action to login and decode the id token to obtain the user id', async () => {
    const store = getStore();
    const inputCredentials = {
      clientname: 'testClient',
      username: 'testuser@test.com',
      password: 'test',
    };

    const { action } = await store.dispatch(
      actions.login(inputCredentials, after),
    );

    expect(action.type).toEqual(types.LOGIN_SUCCESS);
    expect(action.payload).toEqual({
      after,
      userId: '443',
      clientId: 'testClient',
      username: 'testuser@test.com',
      accessToken: 'myaccesstoken',
    });
  });

  it('should save credentials and tokens to secureStorage', async () => {
    const store = getStore();
    const inputCredentials = {
      clientname: 'testClient',
      username: 'testuser@test.com',
      password: 'test',
    };

    await store.dispatch(actions.login(inputCredentials));

    expect(secureStore.saveCredentials).toHaveBeenCalled();
    expect(secureStore.saveCredentials).toBeCalledWith(
      inputCredentials.clientname,
      inputCredentials.username,
      inputCredentials.password,
    );

    expect(secureStore.saveTokens).toHaveBeenCalled();
    expect(secureStore.saveTokens).toBeCalledWith(
      inputCredentials.username,
      loginResponse.id_token,
      loginResponse.access_token,
      loginResponse.expires_in,
    );
  });

  it('should actions flows as expected', async () => {
    const store = getStore();
    const inputCredentials = {
      clientname: 'testClient',
      username: 'testuser@test.com',
      password: 'test',
    };

    const expectedActions = [
      { type: types.LOGIN_START },
      {
        type: types.LOGIN_SUCCESS,
        payload: {
          after,
          userId: '443',
          clientId: 'testClient',
          username: 'testuser@test.com',
          accessToken: 'myaccesstoken',
        },
      },
    ];
    await store.dispatch(actions.login(inputCredentials, after));
    await flushMicrotasksQueue();
    const dispatchedActions = await store.getActions();
    expect(dispatchedActions).toEqual(expectedActions);
  });
});

describe('Login tests with invalid id tokens', () => {
  it('should create an action with sub value when id token has no user id', async () => {
    const store = getStore(
      {
        login: () => ({
          data: {
            access_token: 'myaccesstoken',
            id_token:
              'eyzhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyM30.gU7osPNfTHk2PWfnygFnCFzoZl6t7lWo0RC_X-hQRFc',
            scope: 'openid profile email address phone',
            expires_in: 86400,
            token_type: 'Bearer',
          },
        }),
      },
      {
        user: {},
      },
    );
    const inputCredentials = {
      clientname: 'testClient',
      username: 'testuser@test.com',
      password: 'test',
    };
    const { action } = await store.dispatch(
      actions.login(inputCredentials, after),
    );
    const expectedPayload = {
      after,
      userId: 'auth0',
      clientId: 'testClient',
      username: 'testuser@test.com',
      accessToken: 'myaccesstoken',
    };

    expect(action.type).toEqual(types.LOGIN_SUCCESS);
    expect(action.payload).toEqual(expectedPayload);
  });

  it('should create an action with undefined userid when id token has no sub field', async () => {
    const store = getStore(
      {
        login: () => ({
          data: {
            access_token: 'myaccesstoken',
            id_token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjN9.dnmr7cjQa_V05elkGRshspObWLSbydCX_Gz5kJ1Mx5U',
            scope: 'openid profile email address phone',
            expires_in: 86400,
            token_type: 'Bearer',
          },
        }),
      },
      {
        user: {},
      },
    );
    const inputCredentials = {
      clientname: 'testClient',
      username: 'testuser@test.com',
      password: 'test',
    };
    const { action } = await store.dispatch(
      actions.login(inputCredentials, after),
    );
    const expectedPayload = {
      after,
      userId: undefined,
      clientId: 'testClient',
      username: 'testuser@test.com',
      accessToken: 'myaccesstoken',
    };

    expect(action.type).toEqual(types.LOGIN_SUCCESS);
    expect(action.payload).toEqual(expectedPayload);
  });
});

describe('Update profile with Member Last Login date', () => {
  it('should create an action to update Member Profile wit Member Last Login', async () => {
    const clientId = 'testClient';
    const userId = '3';
    const store = getStore();
    const expectedActions = [
      { type: types.UPDATE_LAST_LOGIN_START },
      { type: types.UPDATE_LAST_LOGIN_SUCCESS },
    ];

    await store.dispatch(actions.updateLastlogin({ clientId, userId }));
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Fetch member profile from member service', () => {
  it('should create an action to update member profile in store', async () => {
    jest.spyOn(Storage, 'get').mockResolvedValue('en-HK');
    const memberProfile = {
      clientId: undefined,
      memberId: '3',
      preferredLocale: 'en-HK',
    };
    const expectedActions = [
      { type: types.GET_MEMBER_PROFILE_START },
      { type: types.UPDATE_MEMBER_PROFILE_START },
      {
        type: CLEAR_PANEL_CLINICS,
        payload: [],
      },
      {
        type: types.GET_MEMBER_PROFILE_SUCCESS,
        payload: {
          preferredLocale: 'en-HK',
          role: 'Employee',
        },
      },
      {
        type: types.UPDATE_MEMBER_PROFILE_SUCCESS,
        payload: { ...memberProfile, preferredLocale: 'en-HK' },
      },
      {
        type: SET_LOCALE,
        payload: {
          locale: 'en-HK',
          intlLocale: 'en-HK',
          momentLocale: 'en-gb',
          messages: {
            ...localeMessages_en,
            ...heal_en_messages,
            ...shop_en_messages,
          },
          setLocaleCompleted: true,
        },
      },
    ];

    const store = getStore(
      {},
      {
        user: {
          userId: '3',
          preferredLocale: 'en-HK',
        },
      },
    );

    await store.dispatch(actions.getMemberProfile());
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Update profile preferredLocale language', () => {
  it('should create an action to update Member Profile and App Language Locale', async () => {
    const memberProfile = {
      clientId: 'testClient',
      memberId: '3',
      preferredLocale: 'en-HK',
    };

    const setLocaleMessagePayload = {
      locale: 'zh-HK',
      intlLocale: 'zh-Hant-HK',
      momentLocale: 'zh-hk',
      messages: {
        ...localeMessages_zh,
        ...heal_zh_messages,
        ...shop_zh_messages,
      },
    };

    const preferredLocale = 'zh-HK';

    const store = getStore(
      {},
      {
        user: {
          clientId: 'testClient',
          userId: '3',
          membersMap: {
            '3': {
              clientId: 'testClient',
              memberId: '3',
              preferredLocale: 'en-HK',
              role: 'Employee',
            },
          },
        },
      },
    );

    const expectedActions = [
      { type: types.UPDATE_MEMBER_PROFILE_START },
      {
        type: CLEAR_PANEL_CLINICS,
        payload: [],
      },
      {
        type: types.UPDATE_MEMBER_PROFILE_SUCCESS,
        payload: { ...memberProfile, preferredLocale },
      },
      {
        type: SET_LOCALE,
        payload: setLocaleMessagePayload,
      },
    ];

    await store.dispatch(actions.updateMemberProfile(preferredLocale));
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Logout tests', () => {
  it('should create an action to logout', async () => {
    const expectedAction = { type: types.LOGOUT };
    const store = getStore(
      {},
      {
        user: {
          clientId: 'testclientid',
        },
      },
    );

    await store.dispatch(actions.logout());
    await flushMicrotasksQueue();

    expect(store.getActions()).toEqual([
      expect.objectContaining(expectedAction),
    ]);
  });
});

describe('ForgotPassword tests', () => {
  it('should create an action for forgotPassword', async () => {
    const store = getStore({});

    await store.dispatch(
      actions.forgotPassword({ clientId: 'testclientid', username: 'a@b.com' }),
    );

    expect(mockApi.forgotPassword).toHaveBeenCalledWith({
      clientId: 'testclientid',
      username: 'a@b.com',
    });
  });
});

describe('Dependent', () => {
  it('should create an action to update date of birth of their depedent', async () => {
    const expectedActions = [
      { type: types.UPDATE_DEPENDENT_DATE_OF_BIRTH_START },
      { type: types.UPDATE_DEPENDENT_DATE_OF_BIRTH_SUCCESS },
    ];

    const store = getStore();
    await store.dispatch(actions.updateDependentDoB('test@test.com'));

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create an action to send dependent invite', async () => {
    const expectedActions = [
      { type: types.SEND_DEPENDENT_INVITE_START },
      { type: types.SEND_DEPENDENT_INVITE_SUCCESS },
    ];

    const store = getStore();

    await store.dispatch(actions.sendInvitationToDependent('test@test.com'));

    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('ResetPassword tests', () => {
  it('should create an action for resetPassword', async () => {
    jest
      .spyOn(Storage, 'get')
      .mockResolvedValue(`{"clientId":"clientId","username":"username"}`);
    const store = getStore();
    await store.dispatch(actions.resetPassword());
    expect(mockApi.forgotPassword).toHaveBeenCalled();
  });
});

describe('agreeTermsConditions tests', () => {
  it('should update terms and conditions and is edm opted out', async () => {
    const memberProfile = {
      clientId: 'testClient',
      memberId: '3',
      isTermsAccepted: true,
      isEdmOptedOut: false,
    };

    const store = getStore(
      {},
      {
        user: {
          clientId: 'testClient',
          userId: '3',
          membersMap: {
            '3': {
              clientId: 'testClient',
              memberId: '3',
            },
          },
        },
      },
    );

    const expectedActions = [
      { type: types.UPDATE_AGREEMENT_TERMS_CONDITIONS_START },
      {
        type: types.UPDATE_AGREEMENT_TERMS_CONDITIONS_SUCCESS,
        payload: { ...memberProfile },
      },
    ];

    await store.dispatch(actions.agreeTermsConditions(true, false));
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('updateEdmOptedOut tests', () => {
  it('should update edm opted out', async () => {
    const memberProfile = {
      clientId: 'testClient',
      memberId: '3',
      isEdmOptedOut: true,
    };

    const store = getStore(
      {},
      {
        user: {
          clientId: 'testClient',
          userId: '3',
          membersMap: {
            '3': {
              clientId: 'testClient',
              memberId: '3',
            },
          },
        },
      },
    );

    const expectedActions = [
      { type: types.UPDATE_EDM_OPTED_OUT_START },
      {
        type: types.UPDATE_EDM_OPTED_OUT_SUCCESS,
        payload: { ...memberProfile },
      },
    ];

    await store.dispatch(actions.updateEdmOptedOut(true));
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});
