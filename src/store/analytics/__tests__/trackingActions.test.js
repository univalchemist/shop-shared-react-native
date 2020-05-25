import * as trackingActions from '../trackingActions';

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(() => Promise.resolve()),
    setUserProperty: jest.fn(() => Promise.resolve()),
    setUserId: jest.fn(() => Promise.resolve()),
    setCurrentScreen: jest.fn(() => Promise.resolve()),
    logLogin: jest.fn(() => Promise.resolve()),
    trackScreenView: jest.fn(() => Promise.resolve()),
  });
});

const firebaseAnalytics = trackingActions.firebaseAnalytics;

describe('Tracking actions', () => {
  afterEach(() => {
    firebaseAnalytics.setUserId.mockClear();
    firebaseAnalytics.setUserProperty.mockClear();
    firebaseAnalytics.logEvent.mockClear();
    firebaseAnalytics.setCurrentScreen.mockClear();
  });

  it('should track user info', () => {
    const userInfo = { userId: 1, clientId: 'cxadev' };
    trackingActions.trackUserInfo(userInfo);

    expect(firebaseAnalytics.setUserId).toHaveBeenCalledTimes(1);
    expect(firebaseAnalytics.setUserProperty).toHaveBeenCalledTimes(1);
  });

  it('should track user type', () => {
    const userType = 'Employee';
    trackingActions.trackUserType(userType);

    expect(firebaseAnalytics.setUserProperty).toHaveBeenCalledTimes(1);
  });

  it('should log login', () => {
    trackingActions.logLogin();

    expect(firebaseAnalytics.logLogin).toHaveBeenCalledTimes(1);
  });

  it('should track screen view', () => {
    const screen = 'Health';
    trackingActions.trackScreenView(screen);

    expect(firebaseAnalytics.setCurrentScreen).toHaveBeenCalledTimes(1);
  });

  it('should log event', () => {
    const eventParams = {
      event: 'user_action',
      eventParams: {
        action: 'Click on call button',
        category: 'Clinics',
      },
    };
    trackingActions.logEvent(eventParams);

    expect(firebaseAnalytics.logEvent).toHaveBeenCalledTimes(1);
  });

  it('should log action', () => {
    const actionParams = {
      action: 'Click on call button',
      category: 'Clinics',
    };
    trackingActions.logAction(actionParams);

    expect(firebaseAnalytics.logEvent).toHaveBeenCalledTimes(1);
  });
});
