import {
  Box,
  Button,
  Container,
  Loader,
  ScrollView,
  Text,
  ScreenHeadingText,
} from '@wrappers/components';
import { InputField } from '@wrappers/components/FinalForm';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { forgotPassword } from '@store/user/actions';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { debounceAlert } from '@utils';
import {
  validateCompanyCharacters,
  validateEmail,
  validateRequiredCompanyName,
} from '@wrappers/core/validations';
import { getLocalizeServerError } from '@utils/localizeServerError';

const ForgotPasswordScreen = ({ forgotPassword, route }) => {
  const theme = useTheme();
  const intl = useIntl();
  const params = route?.params;

  const initialValues = {
    clientId: params?.clientId,
    username: params?.username,
  };

  const clientnameRef = useRef(null);
  const usernameRef = useRef(null);

  const onSubmit = async ({ clientId, username }) => {
    try {
      await forgotPassword({ clientId, username });

      debounceAlert({
        subject: intl.formatMessage({ id: 'forgotPassword.successTitle' }),
        message: intl.formatMessage(
          { id: 'forgotPassword.successText' },
          { email: username },
        ),
      });
    } catch (error) {
      const { subject, message } = getLocalizeServerError(
        error,
        {
          subjectPrefix: 'serverErrors.forgot.subject',
          prefix: 'serverErrors.forgot',
        },
        intl,
      );
      debounceAlert({
        subject,
        message,
      });
    }
  };

  return (
    initialValues && (
      <Form
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) =>
          submitting ? (
            <Loader />
          ) : (
            <Box
              as={SafeAreaView}
              height="100%"
              backgroundColor={theme.backgroundColor.default}
            >
              <ScrollView>
                <Container mt={4}>
                  <Box pb={2}>
                    <ScreenHeadingText>
                      {intl.formatMessage({
                        id: 'forgotPassword.introText',
                      })}
                    </ScreenHeadingText>
                  </Box>
                  <Box>
                    <Text>
                      {intl.formatMessage({
                        id: 'forgotPassword.instructions',
                      })}
                    </Text>
                  </Box>

                  <Box mt={4}>
                    <Box>
                      <InputField
                        ref={clientnameRef}
                        validate={[
                          validateRequiredCompanyName,
                          validateCompanyCharacters,
                        ]}
                        onSubmitEditing={() => usernameRef.current.focus()}
                        name="clientId"
                        autoCapitalize="none"
                        hint={intl.formatMessage({ id: 'loginClientNameHint' })}
                        label={intl.formatMessage({ id: 'loginClientIdLabel' })}
                        returnKeyType="next"
                        testID="clientId"
                        customStyles={theme.customInputStyles}
                      />
                    </Box>
                    <Box>
                      <InputField
                        validate={validateEmail}
                        ref={usernameRef}
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
                      <Button
                        disabled={submitting}
                        primary
                        onPress={handleSubmit}
                        title={intl.formatMessage({
                          id: 'forgotPassword.submitButtonLabel',
                        })}
                      />
                    </Box>
                  </Box>
                </Container>
              </ScrollView>
            </Box>
          )
        }
      />
    )
  );
};

ForgotPasswordScreen.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
};

export default connect(null, { forgotPassword })(ForgotPasswordScreen);
