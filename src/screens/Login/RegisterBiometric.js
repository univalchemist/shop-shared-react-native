/* istanbul ignore file */
import React, { useEffect, useState } from 'react';

import { FormattedMessage } from 'react-intl';
import {
  Box,
  Button,
  Image,
  ScreenHeadingText,
  Text,
} from '@wrappers/components';

import { useIntl, useTheme } from '@wrappers/core/hooks';
import { useBiometrics, Storage, debounceAlert } from '@utils';
import * as Keychain from 'react-native-keychain';
import {
  iosFaceIdTransparent,
  iosTouchIdTransparent,
  androidFingerPrintTransparent,
} from '@images';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { TERMS_CONDITIONS_MODAL } from '@routes';
import { fetchCredentials } from '@services/secureStore';
import { getLocalizeServerError } from '@utils';
import FeatureToggle from '@config/FeatureToggle';
import {
  ERR_BIOMETRIC_DISABLE,
  ERR_CANCEL,
  ERR_MANY_ATTEMP,
  getErrorCode,
} from '@screens/Login/utils/handleError';
import {
  VerifyFailedScreen,
  VerifyingScreen,
  VerifySuccessScreen,
} from '@screens/Login/widgets/RegisterBiometricWidgets';
import { BIOMETRIC_STATUS } from '@screens/Profile/constants';

export const contentMap = {
  [Keychain.BIOMETRY_TYPE.FACE_ID]: {
    title: 'login.registerBiometrics.titleFaceId',
    image: iosFaceIdTransparent,
    info: 'login.registerBiometrics.infoFaceId',
    note: null,
    agreementBiometricType: 'Face ID',
    type: 'Face ID',
  },
  [Keychain.BIOMETRY_TYPE.TOUCH_ID]: {
    title: 'login.registerBiometrics.titleTouchId',
    image: iosTouchIdTransparent,
    info: 'login.registerBiometrics.infoTouchId',
    note: 'login.registerBiometrics.noteTouchId',
    agreementBiometricType: 'Touch ID',
    type: 'Touch ID',
  },
  [Keychain.BIOMETRY_TYPE.FINGERPRINT]: {
    title: 'login.registerBiometrics.titleFingerprint',
    image: androidFingerPrintTransparent,
    info: 'login.registerBiometrics.infoFingerprint',
    note: 'login.registerBiometrics.noteTouchId',
    agreementBiometricType: 'Fingerprint login',
    type: 'Fingerprint',
  },
  default: {
    title: 'login.registerBiometrics.titleFingerprint',
    image: androidFingerPrintTransparent,
    info: 'login.registerBiometrics.infoFingerprint',
    note: 'login.registerBiometrics.noteTouchId',
    agreementBiometricType: 'Fingerprint login',
    type: 'Fingerprint',
  },
};

const getContent = biometricType =>
  contentMap[biometricType] || contentMap.default;

const MAX_ATTEMP = 3;

export const RegisterBiometric = ({ navigation }) => {
  const theme = useTheme();
  const intl = useIntl();
  const { biometryType } = useBiometrics();
  const [state, setState] = useState({
    isVerifying: false,
    isVerifySuccess: null,
  });
  const [countFail, setCountFail] = useState(0);
  useEffect(() => {
    Storage.save(Storage.IS_FIRST_TIME_LOGIN, 'true');
  }, []);

  const onCancel = () => {
    navigation.goBack();
  };

  const showAlert = error => {
    const { subject, message } = getLocalizeServerError(
      error,
      {
        subjectPrefix: 'errors.registerBiometric.subject',
        prefix: 'errors.registerBiometric',
      },
      intl,
      { biometricType: getContent(biometryType).agreementBiometricType },
    );
    debounceAlert({ subject, message });
  };

  const handleVerifyBiometric = async () => {
    setState({ isVerifying: true, isVerifySuccess: false });
    try {
      const data = await Storage.get(Storage.LOGIN_STORAGE);
      const clientId = JSON.parse(data)?.clientId;
      await fetchCredentials(clientId);
      setState({ isVerifying: false, isVerifySuccess: true });
      Storage.save(BIOMETRIC_STATUS, 'true');
    } catch (e) {
      if (biometryType !== Keychain.BIOMETRY_TYPE.FINGERPRINT) {
        showAlert(e);
      }

      const errCode = getErrorCode(e);
      switch (errCode) {
        case null:
        case undefined:
        case false:
          setCountFail(countFail + 1);
          break;
        case ERR_MANY_ATTEMP:
          setCountFail(MAX_ATTEMP);
          return;
        case ERR_CANCEL:
        case ERR_BIOMETRIC_DISABLE:
        default:
          break;
      }
      setState({ isVerifying: false });
    }
  };

  if (state.isVerifySuccess === true)
    return (
      <VerifySuccessScreen
        navigation={navigation}
        biometricType={getContent(biometryType).type}
        image={getContent(biometryType).image}
      />
    );
  if (countFail >= MAX_ATTEMP)
    return (
      <VerifyFailedScreen
        navigation={navigation}
        biometricType={getContent(biometryType).type}
      />
    );

  if (state.isVerifying) return <VerifyingScreen setState={setState} />;
  return (
    <Box justifyContent={'center'} mx={20} flex={1} as={SafeAreaView}>
      <ScreenHeadingText
        color={theme.modal.text}
        textAlign={'center'}
        fontSize={32}
        lineHeight={50}
      >
        {intl.formatMessage({
          id: getContent(biometryType).title,
        })}
      </ScreenHeadingText>
      <Box py={20} alignItems={'center'}>
        <Image
          source={getContent(biometryType).image}
          width={100}
          height={100}
          resizeMode="contain"
        />
        {biometryType === Keychain.BIOMETRY_TYPE.FINGERPRINT && (
          <Text color={theme.modal.text} textAlign={'center'} mt={8}>
            {intl.formatMessage({
              id: 'login.registerBiometrics.setupFingerprint',
            })}
          </Text>
        )}
      </Box>

      <Text color={theme.modal.text} textAlign={'center'} fontSize={16}>
        {intl.formatMessage({ id: getContent(biometryType).info })}
      </Text>
      {getContent(biometryType).note && (
        <Text
          color={theme.modal.text}
          textAlign={'center'}
          fontSize={14}
          mt={20}
        >
          {intl.formatMessage({ id: getContent(biometryType).note })}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate(TERMS_CONDITIONS_MODAL)}
      >
        <Text
          color={theme.modal.text}
          textAlign={'center'}
          mt={20}
          fontSize={14}
        >
          <FormattedMessage
            id="login.registerBiometrics.agreement"
            values={{
              termsAndConditions: (
                <Text
                  fontWeight={'bold'}
                  color={theme.modal.text}
                  fontSize={14}
                >
                  {intl.formatMessage({
                    id: 'login.termsAndConditions',
                  })}
                </Text>
              ),
              biometricType: getContent(biometryType).agreementBiometricType,
            }}
          />
        </Text>
      </TouchableOpacity>
      <Box mt={20}>
        <Button
          primary
          title={intl.formatMessage({
            id: 'login.registerBiometrics.buttonSetup',
          })}
          onPress={handleVerifyBiometric}
        />
      </Box>
      <Box mt={20}>
        <Button
          secondary
          title={intl.formatMessage({
            id: 'login.registerBiometrics.buttonCancel',
          })}
          onPress={onCancel}
        />
      </Box>
      <Text color={theme.modal.text} textAlign={'center'} mt={20} fontSize={14}>
        {intl.formatMessage(
          { id: 'login.registerBiometrics.guideLaterText' },
          { biometricType: getContent(biometryType).agreementBiometricType },
        )}
      </Text>
    </Box>
  );
};

export default RegisterBiometric;
