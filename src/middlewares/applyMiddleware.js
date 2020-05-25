import { applyMiddleware } from 'redux';
import { compose } from 'ramda';

const idDev = process.env.NODE_ENV === 'development';

export default (...middleware) => {
  if (idDev) {
    const {
      composeWithDevTools,
    } = require('redux-devtools-extension/developmentOnly');

    return compose(composeWithDevTools, applyMiddleware)(...middleware);
  }

  return applyMiddleware(...middleware);
};
