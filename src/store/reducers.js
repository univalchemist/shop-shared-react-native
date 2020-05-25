import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { LOGOUT } from '@store/user/types';
import claim from './claim/reducer';
import claimType from './claimType/reducer';
import health from './health/reducer';
import intl from './intl/reducer';
import user from './user/reducer';
import wallet from './wallet/reducer';
import help from './help/reducer';
import panel from './panel/reducer';
import benefit from './benefit/reducer';
import document from './document/reducer';
import legal from './legal/reducer';
import analytics from './analytics/reducer';
import ssoLogin from './ssoLogin/reducer';
import contact from './contact/reducer';
import shop from '@shops/store/reducers';
import heal from '@heal/src/store/reducers';
const appReducer = combineReducers({
  user,
  health,
  claim,
  claimType,
  intl,
  legal,
  wallet,
  help,
  panel,
  benefit,
  document,
  analytics,
  form: formReducer,
  ssoLogin,
  contact,
  shop,
  heal,
});

export default (state, action) => {
  if (action.type === LOGOUT) {
    state = {
      intl: state.intl,
    };
  }
  return appReducer(state, action);
};
