import React from 'react';
import BiometricSettingScreen from '../BiometricSettingScreen';
import { renderForTest } from '@testUtils';
import DeviceInfo from 'react-native-device-info';
import { Switch, Alert, Platform } from 'react-native';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import * as Utils from '@utils';
import * as biometricUtils from '@utils/biometrics';
import * as secureStoreUtils from '@services/secureStore';

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

describe('BiometricSettingScreen', () => {
  jest.spyOn(DeviceInfo, 'getDeviceId').mockReturnValue('deviceId');
  it('should render correctly', () => {
    const component = renderForTest(<BiometricSettingScreen />);

    expect(component).toMatchSnapshot();
  });
  describe('on iOS', () => {
    Platform.OS = 'ios';
    it('should alert when disabling biometric', async () => {
      const component = renderForTest(<BiometricSettingScreen />);
      const switchButton = component.getByType(Switch);
      jest.spyOn(Utils.Storage, 'save').mockResolvedValue();

      act(() => {
        fireEvent(switchButton, 'onValueChange');
      });

      act(() => {
        Alert.alert.mock.calls[0][2][1].onPress();
      });
      await flushMicrotasksQueue();

      expect(Alert.alert).toHaveBeenCalled();
      expect(Utils.Storage.save).toHaveBeenCalled();
    });

    it('should alert when enabling biometric', async () => {
      const component = renderForTest(<BiometricSettingScreen />);
      const switchButton = component.getByType(Switch);

      act(() => {
        fireEvent(switchButton, 'valueChange', true);
      });

      act(() => {
        Alert.alert.mock.calls[1][2][1].onPress();
      });
      await flushMicrotasksQueue();

      expect(Alert.alert).toHaveBeenCalled();
    });

    it('should alert for  when enabling biometric', async () => {
      const component = renderForTest(<BiometricSettingScreen />);
      const switchButton = component.getByType(Switch);

      act(() => {
        fireEvent(switchButton, 'valueChange', true);
      });

      act(() => {
        Alert.alert.mock.calls[1][2][1].onPress();
      });
      await flushMicrotasksQueue();

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should alert fail when enabling biometric without biometric', async () => {
      const component = renderForTest(<BiometricSettingScreen />);
      const switchButton = component.getByType(Switch);
      jest
        .spyOn(biometricUtils, 'useBiometrics')
        .mockReturnValue({ biometryType: 'FaceID' });
      jest
        .spyOn(biometricUtils, 'getBiometricDeviceType')
        .mockReturnValue('Fingerprint');

      act(() => {
        fireEvent(switchButton, 'valueChange', true);
      });
      expect(Alert.alert).toHaveBeenCalled();
    });

    it('should fetchCredentials when enabling biometric', async () => {
      const component = renderForTest(<BiometricSettingScreen />);
      const switchButton = component.getByType(Switch);
      jest.spyOn(Utils.Storage, 'save').mockResolvedValue();
      jest
        .spyOn(biometricUtils, 'useBiometrics')
        .mockReturnValue({ biometryType: 'Fingerprint' });
      jest
        .spyOn(biometricUtils, 'getBiometricDeviceType')
        .mockReturnValue('Fingerprint');
      jest
        .spyOn(secureStoreUtils, 'fetchCredentials')
        .mockResolvedValue({ username: 'username', password: 'P@ssw0rd' });

      act(() => {
        fireEvent(switchButton, 'valueChange', true);
      });

      act(() => {
        Alert.alert.mock.calls[1][2][1].onPress();
      });

      await flushMicrotasksQueue();

      expect(Utils.Storage.save).toHaveBeenCalled();
      expect(secureStoreUtils.fetchCredentials).toHaveBeenCalled();
    });
  });
});
