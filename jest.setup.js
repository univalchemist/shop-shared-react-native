/* eslint-disable no-undef */
import { NativeModules } from 'react-native';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

NativeModules.ReactLocalization = {
  language: 'en',
};

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));
jest.mock('@react-native-firebase/remote-config', () => {
  const remoteConfig = () => {
    return {
      setDefaults: jest.fn(),
      setConfigSettings: jest.fn(),
      fetch: jest.fn(),
      fetchAndActivate: jest.fn(),
      getAll: jest.fn(),
    };
  };

  return remoteConfig;
});
jest.mock('react-native-maps', () => {
  const React = require.requireActual('react');
  const MapView = require.requireActual('react-native-maps');

  class MockCallout extends React.Component {
    render() {
      return React.createElement('Callout', this.props, this.props.children);
    }
  }

  class MockMarker extends React.Component {
    render() {
      return React.createElement('Marker', this.props, this.props.children);
    }
  }

  class MockMapView extends React.Component {
    render() {
      return React.createElement('MapView', this.props, this.props.children);
    }
  }
  MockCallout.propTypes = MapView.Callout.propTypes;
  MockMarker.propTypes = MapView.Marker.propTypes;
  MockMapView.propTypes = MapView.propTypes;
  MockMapView.Marker = MockMarker;
  MockMapView.Callout = MockCallout;
  MockMapView.prototype.animateToRegion = jest.fn();
  MockMapView.prototype.fitToCoordinates = jest.fn();
  return MockMapView;
});

jest.mock('@react-native-firebase/analytics', () => () => {});
jest.mock('@react-native-firebase/perf', () => () => {});
jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.mock('react-native-appearance', () => ({
  Appearance: {
    getColorScheme: jest.fn().mockImplementation(() => 'light'),
  },
}));

jest.mock('react-native-keychain', () => ({
  getSupportedBiometryType: jest.fn(),
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  setInternetCredentials: jest.fn(),
  getInternetCredentials: jest.fn(),
  resetInternetCredentials: jest.fn(),
  BIOMETRY_TYPE: {
    TOUCH_ID: 'TouchID',
    FACE_ID: 'FaceID',
    FINGERPRINT: 'Fingerprint',
  },
  ACCESS_CONTROL: {
    USER_PRESENCE: 'UserPresence',
    BIOMETRY_ANY: 'BiometryAny',
    BIOMETRY_CURRENT_SET: 'BiometryCurrentSet',
    DEVICE_PASSCODE: 'DevicePasscode',
    APPLICATION_PASSWORD: 'ApplicationPassword',
    BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BiometryAnyOrDevicePasscode',
    BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE:
      'BiometryCurrentSetOrDevicePasscode',
  },
  AUTHENTICATION_TYPE: {
    DEVICE_PASSCODE_OR_BIOMETRICS: 'AuthenticationWithBiometricsDevicePasscode',
    BIOMETRICS: 'AuthenticationWithBiometrics',
  },
}));

jest.mock('react-native-device-info', () => ({
  getDeviceName: jest.fn(),
  getDeviceId: jest.fn(),
}));

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
