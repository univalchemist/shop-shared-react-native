import { createPromise } from 'redux-promise-middleware';
import {
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_LAST_LOGIN_ERROR,
} from '@store/user/types';
import { updateLastlogin, getMemberProfile } from '@store/user/actions';
import {
  fetchTokens,
  clearCredentials,
  clearTokens,
} from '@services/secureStore';
import { isNotEmpty } from '@utils';
import { customTrace } from './helpers';
import createHeadersMiddleware from './headersMiddleware';

export { default as applyMiddleware } from './applyMiddleware';

export const PromiseStatus = {
  START: 'START',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const reduxPromise = createPromise({
  promiseTypeSuffixes: [
    PromiseStatus.START,
    PromiseStatus.SUCCESS,
    PromiseStatus.ERROR,
  ],
});

const sessionKey = 'Authorization';
const localeKey = 'Accept-Language';
let _locale;

export const headersMiddleware = createHeadersMiddleware({
  // something like that
  // debug: ({ headers, action }) => {
  //   if (action.type.endsWith(PromiseStatus.START)) {
  //     console.log('Debug: ', headers);
  //   }
  // },

  auth: {
    setToken: async headers => {
      const { access_token } = await fetchTokens();

      headers[sessionKey] = `Bearer ${access_token}`;
    },
  },

  login: {
    filterBy: ({ type }) => type === LOGIN_SUCCESS,

    handler: ({ store, action }) => {
      return async function after(headers) {
        const { dispatch } = store;
        const { payload } = action;

        customTrace();

        await dispatch(updateLastlogin(payload));
        const { value } = await dispatch(getMemberProfile(payload));

        // TODO find better way
        isNotEmpty(payload.after) && payload.after(value);
      };
    },
  },

  logout: {
    filterBy: ({ type }) => type === LOGOUT,

    handler: ({ store }) => {
      return async function after(headers) {
        const { getState } = store;
        const { clientId } = getState().user;

        headers[sessionKey] = null;

        clearTokens();
      };
    },
  },

  subscribe: ({ store, action }, reset) => {
    // TODO find better way
    // when login fail by update last login, should reset login state
    if (action.type === UPDATE_LAST_LOGIN_ERROR) {
      reset();
    }

    return async function always(headers) {
      const { getState, dispatch } = store;
      const { locale } = getState().intl;
      const { type } = action;

      if (locale !== _locale && type.endsWith(PromiseStatus.START)) {
        headers[localeKey] = locale;

        dispatch({
          type: '@@headersMiddleware/CHANGE_LOCALE',
          payload: {
            from: _locale,
            to: locale,
          },
        });

        _locale = locale;
      }
    };
  },
});
