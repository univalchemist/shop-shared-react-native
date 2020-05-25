import axios from 'axios';
import { noop } from '@utils';
import { falshy } from './helpers';

const { common: _headers } = axios.defaults.headers;
const promisify = () => Promise.resolve(_headers);
const handler = () => promisify;

const createSessionMiddleware = ({
  debug = noop,
  subscribe = handler,
  auth = {},
  login = {},
  logout = {},
} = {}) => {
  let _isLoggedIn = false;

  auth.setToken = auth.setToken || promisify;
  login.filterBy = login.filterBy || falshy;
  login.handler = login.handler || handler;
  logout.filterBy = logout.filterBy || falshy;
  logout.handler = logout.handler || handler;

  return store => next => action => {
    const _isLoginType = login.filterBy(action);
    const _isLogoutType = logout.filterBy(action);
    const _args = { store, action };

    subscribe(_args, () => {
      _isLoggedIn = false;
      _isLoggedIn = false;
    })(_headers);

    if (!_isLoggedIn && _isLoginType) {
      _isLoggedIn = true;

      // make sure, pass headers after finish login
      // then login.handler can get headers as argument
      auth
        .setToken(_headers)
        .then(() => _headers)
        .then(login.handler(_args));
    }

    if (_isLoggedIn && _isLogoutType) {
      _isLoggedIn = false;

      logout.handler(_args)(_headers);
    }

    // almost same as `subscribe` function
    // but debug function is not promise
    debug({
      _isLoggedIn,
      _isLoginType,
      _isLogoutType,
      ..._args,
      headers: _headers,
    });

    return next(action);
  };
};

export default createSessionMiddleware;
