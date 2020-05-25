import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { requestPermission } from '../GrantLocationPermission';



describe('Grant location permission ', () => {

  it('should get current user location when location permission is granted', async () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.GRANTED);

    const result = await requestPermission();

    expect(result).toBe(true);
  });

  it('should not get current user location when location permission is denied', async () => {
    Platform.OS = 'android';

    jest
      .spyOn(PermissionsAndroid, 'request')
      .mockResolvedValue(PermissionsAndroid.RESULTS.DENIED);

    const result = await requestPermission();

    expect(result).toBe(false);
  });

})
