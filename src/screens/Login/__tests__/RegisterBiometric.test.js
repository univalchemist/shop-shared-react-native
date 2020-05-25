import { render } from '@testUtils';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import navigation from '@testUtils/__mocks__/navigation';
import messages from '@messages/en-HK.json';
import RegisterBiometric, {
  contentMap,
} from '@screens/Login/RegisterBiometric';

describe('ForgotPasswordScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  let screen;
  it('should render FaceId content when biometricType is FaceId ', async () => {
    Keychain.getSupportedBiometryType.mockResolvedValue('FaceID');
    [screen] = render(<RegisterBiometric navigation={navigation} />);
    console.log(
      contentMap[Keychain.BIOMETRY_TYPE.FACE_ID].title,
      messages[contentMap[Keychain.BIOMETRY_TYPE.FACE_ID].title],
    );
    expect(
      screen.getByText('Would you like to setup biometric for login?'),
    ).toBeDefined();
  });
});
