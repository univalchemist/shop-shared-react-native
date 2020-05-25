import {
  Box,
  Button,
  Container,
  Loader,
  ScrollView,
  Text,
  ScreenHeadingText,
  Image,
} from '@wrappers/components';
import { InputField } from '@wrappers/components/FinalForm';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import {
  TERMS_CONDITIONS_MODAL,
  FORGOT_PASSWORD,
  CONTACT_SCREEN,
  LANGUAGE_SETTING_SCREEN,
} from '@routes';
import { Storage, debounceAlert, useBiometrics } from '@utils';
import { login } from '@store/user/actions';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import {
  validateCompanyCharacters,
  validateEmail,
  validatePassword,
  validateRequiredCompanyName,
} from '@wrappers/core/validations';
import { authenticateAsync } from 'expo-local-authentication';
import { fetchCredentials } from '@services/secureStore';
import FeatureToggle from '@config/FeatureToggle';
import { getLocalizeServerError } from '../../utils/localizeServerError';
import { phoneIcon } from '@images';
import { localeIconMap } from '@config/locale';
import { useFirebase } from '@navigations';
import {
  hsbcLifeLogo,
  iosFaceId,
  iosTouchId,
  androidFingerPrint,
} from '@images';

const mapStateToProps = ({ intl: { locale } }) => ({
  locale,
});

const enhance = compose(connect(mapStateToProps, { login }));

export const LoginScreen = ({ login, locale, navigation }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [savedLoginCredentials, setSavedLoginCredentials] = useState(null);
  const { biometryType } = useBiometrics();
  const theme = useTheme();
  const intl = useIntl();
  const { updateClientId } = useFirebase();
  const languageIcon = localeIconMap[locale];

  const onSubmit = async values => {
    try {
      await login(values, ({ clientId }) => {
        updateClientId(clientId);
      });
    } catch (error) {
      const { subject, message } = getLocalizeServerError(
        error,
        {
          subjectPrefix: 'serverErrors.login.subject',
          prefix: 'serverErrors.login',
        },
        intl,
        { email: values.username },
      );

      debounceAlert({ subject, message });

      return {
        [FORM_ERROR]: message,
      };
    }
  };

  const handleBiometricsLogin = async () => {
    if (savedLoginCredentials) {
      const { clientId } = JSON.parse(savedLoginCredentials);
      const { username, password } = await fetchCredentials(clientId);
      if (username && password) {
        const credentials = {
          clientname: clientId,
          password,
          username,
        };
        onSubmit(credentials);
      }
    }
  };

  useEffect(() => {
    async function initialize() {
      const data = await Storage.get(Storage.LOGIN_STORAGE);
      setSavedLoginCredentials(data);
      if (data) {
        const { clientId, username } = JSON.parse(data);
        setInitialValues({
          clientname: clientId,
          username,
        });
      } else {
        setInitialValues({});
      }
      clientnameRef.current.focus();
    }
    initialize();
  }, []);

  const clientnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const renderBiometryButton = handleSubmit => {
    if (FeatureToggle.USE_BIOMETRICS.on && savedLoginCredentials) {
      let source = null;
      switch (biometryType) {
        case Keychain.BIOMETRY_TYPE.FACE_ID:
          source = iosFaceId;
          break;
        case Keychain.BIOMETRY_TYPE.TOUCH_ID:
          source = iosTouchId;
          break;
        case Keychain.BIOMETRY_TYPE.FINGERPRINT:
          source = androidFingerPrint;
          break;
      }
      return (
        <TouchableOpacity
          onPress={handleBiometricsLogin}
          style={{
            marginTop: 24,
            alignItems: 'center',
          }}
        >
          <Image source={source} width={69} height={69} resizeMode="contain" />
        </TouchableOpacity>
      );
    } else return null;
  };

  return (
    initialValues && (
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, submitSucceeded, values }) =>
          submitting || submitSucceeded ? (
            <Loader
              loadingText={intl.formatMessage({ id: 'loginSubmitLoadingText' })}
            />
          ) : (
            <Box
              as={SafeAreaView}
              height="100%"
              backgroundColor={theme.backgroundColor.default}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}
              >
                <Container mt={2} flex={1}>
                  <Image
                    mb={3}
                    source={hsbcLifeLogo}
                    style={{ width: 88, height: 24 }}
                    resizeMode="contain"
                  />

                  <Box>
                    <ScreenHeadingText>
                      {intl.formatMessage({ id: 'loginWelcomeToText' })}
                    </ScreenHeadingText>
                    <ScreenHeadingText fontWeight={'bold'}>
                      {intl.formatMessage({ id: 'loginProductNameText' })}
                    </ScreenHeadingText>
                  </Box>

                  <Box mt={4}>
                    <Box>
                      <InputField
                        ref={clientnameRef}
                        validate={[
                          validateRequiredCompanyName,
                          validateCompanyCharacters,
                        ]}
                        onSubmitEditing={usernameRef.current?.focus}
                        name="clientname"
                        autoCapitalize="none"
                        hint={intl.formatMessage({ id: 'loginClientNameHint' })}
                        label={intl.formatMessage({ id: 'loginClientIdLabel' })}
                        returnKeyType="next"
                        testID="clientname"
                        customStyles={theme.customInputStyles}
                      />
                    </Box>
                    <Box>
                      <InputField
                        validate={validateEmail}
                        ref={usernameRef}
                        onSubmitEditing={passwordRef.current?.focus}
                        name="username"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        label={intl.formatMessage({ id: 'loginUsernameLabel' })}
                        returnKeyType="next"
                        testID="username"
                        customStyles={theme.customInputStyles}
                      />
                    </Box>
                    <Box>
                      <InputField
                        validate={validatePassword}
                        ref={passwordRef}
                        name="password"
                        secureTextEntry
                        onSubmitEditing={handleSubmit}
                        label={intl.formatMessage({ id: 'loginPasswordLabel' })}
                        returnKeyType="send"
                        testID="password"
                        customStyles={theme.customInputStyles}
                      />
                    </Box>
                    <Box>
                      <Button
                        disabled={submitting}
                        primary
                        onPress={handleSubmit}
                        title={intl.formatMessage({ id: 'loginButtonText' })}
                      />
                    </Box>
                    <Box mt={23}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(FORGOT_PASSWORD, {
                            clientId: values.clientname,
                            username: values.username,
                          });
                        }}
                        activeOpacity={0.5}
                      >
                        <Text color="fonts.blackLink" textAlign="center">
                          {intl.formatMessage({
                            id: 'loginForgotPasswordLinkText',
                          })}
                        </Text>
                      </TouchableOpacity>
                    </Box>
                    {renderBiometryButton(handleSubmit)}
                  </Box>
                </Container>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  px={4}
                  pb={3}
                >
                  <Box flex={0.7}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(TERMS_CONDITIONS_MODAL)
                      }
                      activeOpacity={0.5}
                    >
                      <Text textAlign="left">
                        <FormattedMessage
                          id="login.agreeToTermsAndConditions"
                          values={{
                            termsAndConditions: (
                              <Text color="fonts.blackLink">
                                {intl.formatMessage({
                                  id: 'login.termsAndConditions',
                                })}
                              </Text>
                            ),
                          }}
                        />
                      </Text>
                    </TouchableOpacity>
                  </Box>

                  <Box flex={0.15} justifyContent="center">
                    <TouchableOpacity
                      onPress={() => navigation.navigate(CONTACT_SCREEN)}
                      activeOpacity={0.5}
                      style={{
                        alignItems: 'flex-end',
                      }}
                    >
                      <Image width={24} height={24} source={phoneIcon} />
                    </TouchableOpacity>
                  </Box>

                  <Box flex={0.15} justifyContent="center">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(LANGUAGE_SETTING_SCREEN)
                      }
                      activeOpacity={0.5}
                      style={{
                        alignItems: 'flex-end',
                      }}
                    >
                      <Image width={24} height={24} source={languageIcon} />
                    </TouchableOpacity>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          )
        }
      />
    )
  );
};

LoginScreen.propTypes = {
  login: PropTypes.func.isRequired,
};

export default enhance(LoginScreen);
