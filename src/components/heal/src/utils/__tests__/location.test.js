import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {
  checkLocationPermission,
  getCurrentPosition,
  getCurrentPositionWithoutCheckingPermission,
} from '../location';
import { flushMicrotasksQueue } from 'react-native-testing-library';

jest.mock('react-native-permissions', () => ({
  check: jest
    .fn()
    .mockImplementation(() => new Promise(resolve => resolve('granted'))),
  PERMISSIONS: {
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
    },
    IOS: {
      LOCATION_WHEN_IN_USE: 'ios.permission.LOCATION_WHEN_IN_USE',
    },
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    BLOCKED: 'blocked',
    GRANTED: 'granted',
  },
}));

describe('test checkLocationPermission', () => {
  it('checkLocationPermission should check ios location permission', () => {
    Platform.OS = 'ios';
    checkLocationPermission();
    expect(check).toHaveBeenCalledWith(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  });

  it('checkLocationPermission should check android location permission', () => {
    Platform.OS = 'android';
    checkLocationPermission();
    expect(check).toHaveBeenCalledWith(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
  });
});

describe('test getCurrentPosition', () => {
  let originalNavigator;
  beforeAll(() => {
    Platform.OS = 'ios';
    originalNavigator = global.navigator;
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn(),
        requestAuthorization: jest.fn(),
      },
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call api get current position', async () => {
    getCurrentPosition();
    await flushMicrotasksQueue();
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should call get current position without check permission', () => {
    getCurrentPositionWithoutCheckingPermission();
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
  });
});
