import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';
import { BIOMETRIC_TYPE } from '@screens/Profile/constants';

export const useBiometrics = () => {
  const [state, setState] = useState({
    biometryType: null,
  });
  useEffect(() => {
    const getBiometryType = async () => {
      const result = await Keychain.getSupportedBiometryType();
      setState({
        biometryType: result,
      });
    };

    getBiometryType();
  }, []);
  return state;
};

export const getBiometricDeviceType = () => {
  if (Platform === 'android') return 'Fingerprint';
  const touchIdIPhoneList = [
    'iphone5s',
    'iphonese',
    'iphone6',
    'iphone7',
    'iphone8',
  ];
  const deviceId = DeviceInfo.getDeviceId();
  const lowerCaseDeviceId = deviceId.toLowerCase();
  if (touchIdIPhoneList.includes(lowerCaseDeviceId))
    return BIOMETRIC_TYPE.TOUCH_ID;
  return BIOMETRIC_TYPE.FACE_ID;
};
