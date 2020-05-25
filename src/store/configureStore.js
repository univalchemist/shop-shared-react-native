import { createStore } from 'redux';
import thunk from 'redux-thunk';
import api from '@services/api';
import healApi from '@heal/src/services/api';
import shopApi from '@shops/services/api';
import { applyMiddleware, reduxPromise, headersMiddleware } from '@middlewares';
import reducers from './reducers';

const middlewares = applyMiddleware(
  thunk.withExtraArgument({ api: { ...api, ...healApi, ...shopApi } }),
  reduxPromise,
  headersMiddleware,
);

export default initialState => {
  const store = createStore(reducers, initialState, middlewares);

  return store;
};
