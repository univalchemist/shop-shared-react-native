import reducer from '../reducer';
import * as types from '../types';
import * as TrackingActions from '../trackingActions';

describe('Analytics reducer', () => {
  it('should return the initialState', () => {
    const expectedState = {};
    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  describe('LOGIN_SUCCESS', () => {
    let succesfulLoginAction;
    beforeEach(() => {
      jest.spyOn(TrackingActions, 'trackUserInfo').mockClear();
      jest.spyOn(TrackingActions, 'logLogin').mockClear();

      succesfulLoginAction = {
        type: types.LOGIN_SUCCESS,
        payload: {
          userId: 24,
          clientId: 'testClientId',
        },
      };
      reducer({}, succesfulLoginAction);
    });
    it('should track user info', () => {
      expect(TrackingActions.trackUserInfo).toHaveBeenCalledTimes(1);
      expect(TrackingActions.trackUserInfo).toHaveBeenCalledWith(
        succesfulLoginAction.payload,
      );
    });
    it('should log login', () => {
      expect(TrackingActions.logLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET_MEMBER_PROFILE_SUCCESS', () => {
    let getMemberProfileAction;
    beforeEach(() => {
      jest.spyOn(TrackingActions, 'trackUserType').mockClear();

      getMemberProfileAction = {
        type: types.GET_MEMBER_PROFILE_SUCCESS,
        payload: {
          role: 'Employee',
        },
      };
      reducer({}, getMemberProfileAction);
    });

    it('should track user type', () => {
      expect(TrackingActions.trackUserType).toHaveBeenCalledTimes(1);
      expect(TrackingActions.trackUserType).toHaveBeenCalledWith(
        getMemberProfileAction.payload.role,
      );
    });
  });

  describe('LOGOUT', () => {
    let logoutAction;

    beforeEach(() => {
      jest.spyOn(TrackingActions, 'logLogout').mockClear();

      logoutAction = {
        type: types.LOGOUT,
        payload: {
          clientId: 'someClientId',
          userId: 40,
        },
      };

      reducer({}, logoutAction);
    });

    it('should log logout using action payload', () => {
      expect(TrackingActions.logLogout).toHaveBeenCalledTimes(1);
      expect(TrackingActions.logLogout).toHaveBeenCalledWith(
        logoutAction.payload,
      );
    });
  });
});
