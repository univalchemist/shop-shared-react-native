import createHeadersiddleware from '../headersMiddleware';

jest.mock('axios', () => {
  return {
    defaults: {
      headers: {
        common: [],
      },
    },
  };
});

describe('headersMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tokens = 'cxa-group-bearer-tokens';
  const store = {
    getState: () => ({
      cxaGroup: true,
    }),

    dispatch: jest.fn(),
  };
  const next = action => action;

  it('should be debugging function work properly', done => {
    const loginType = 'LOGIN_SUCCESS';
    const action = { type: loginType, payload: 'awesome!' };
    const config = {
      auth: {
        setToken: async headers => {},
      },

      login: {
        filterBy: ({ type }) => type === loginType,
      },

      debug: ({ store, action }) => {
        const { dispatch, getState } = store;

        expect(getState().cxaGroup).toBeTruthy();
        expect(dispatch).toStrictEqual(store.dispatch);
        expect(action.type).toEqual(loginType);
        expect(action.payload).toEqual('awesome!');

        done();
      },
    };

    const headersMiddleware = createHeadersiddleware(config);

    headersMiddleware(store)(next)(action);
  });

  it('should be successful to pass login logic', done => {
    const loginType = 'LOGIN_SUCCESS';
    const action = { type: loginType };
    const config = {
      auth: {
        setToken: async headers => {},
      },

      login: {
        filterBy: ({ type }) => type === loginType,
      },

      debug: ({ _isLoggedIn }) => {
        expect(_isLoggedIn).toBeTruthy();

        done();
      },
    };

    const headersMiddleware = createHeadersiddleware(config);

    headersMiddleware(store)(next)(action);
  });

  it('should be passing headers to handler', done => {
    const loginType = 'LOGIN_SUCCESS';
    const action = { type: loginType };
    const config = {
      auth: {
        setToken: async headers => {
          headers.Authorization = tokens;
        },
      },

      login: {
        filterBy: ({ type }) => type === loginType,
        handler: () => async headers => {
          expect(headers.Authorization).toEqual(tokens);

          done();
        },
      },
    };

    const headersMiddleware = createHeadersiddleware(config);

    headersMiddleware(store)(next)(action);
  });

  it('should be called logout.hander only 1 time', () => {
    const loginType = 'LOGIN_SUCCESS';
    const loggoutType = 'LOGGOUT';
    const config = {
      auth: {
        setToken: async headers => {
          headers.Authorization = tokens;
        },
      },

      login: {
        filterBy: ({ type }) => type === loginType,
        handler: () => async headers => {},
      },

      logout: {
        filterBy: ({ type }) => type === loggoutType,
        handler: jest.fn(() => async () => {}),
      },
    };

    const headersMiddleware = createHeadersiddleware(config);

    headersMiddleware(store)(next)({ type: loginType });
    headersMiddleware(store)(next)({ type: loggoutType });
    headersMiddleware(store)(next)({ type: loggoutType });

    expect(config.logout.handler).toHaveBeenCalledTimes(1);
  });

  it('should be called subscribe all the time when middleware calls', () => {
    const loginType = 'LOGIN_SUCCESS';
    const loggoutType = 'LOGGOUT';
    const config = {
      auth: {
        setToken: async headers => {
          headers.Authorization = tokens;
        },
      },

      login: {
        filterBy: ({ type }) => type === loginType,
        handler: () => async headers => {},
      },

      logout: {
        filterBy: ({ type }) => type === loggoutType,
        handler: () => async () => {},
      },

      subscribe: jest.fn(() => async () => {}),
    };

    const headersMiddleware = createHeadersiddleware(config);

    headersMiddleware(store)(next)({ type: loginType });
    headersMiddleware(store)(next)({ type: loggoutType });
    headersMiddleware(store)(next)({ type: loggoutType });

    expect(config.subscribe).toHaveBeenCalledTimes(3);
  });
});
