import * as types from './types';
import {
  trackUserInfo,
  logLogin,
  logLogout,
  trackUserType,
} from './trackingActions';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      trackUserInfo(action.payload);
      logLogin();
      break;

    case types.GET_MEMBER_PROFILE_SUCCESS:
      trackUserType(action.payload.role);

      break;
    case types.LOGOUT:
      logLogout(action.payload);
      break;
  }

  return state;
};

export default reducer;
