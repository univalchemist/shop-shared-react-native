import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const checkLocationPermission = () => {
  if (Platform.OS === 'ios') return check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  else return check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
};

export const getCurrentPosition = (successCallback, errorCallback) => {
  checkLocationPermission().then(result => {
    // Only get location if location permission is granted or never asked before
    if (result === RESULTS.GRANTED || result === RESULTS.DENIED)
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          successCallback({ latitude, longitude });
        },
        errorCallback,
      );
  });
};

export const getCurrentPositionWithoutCheckingPermission = (
  successCallback,
  errorCallback,
) => {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};
