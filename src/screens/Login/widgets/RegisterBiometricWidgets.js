/* istanbul ignore file */
import { useIntl, useTheme } from '@wrappers/core/hooks';
import {
  Box,
  Button,
  Image,
  ScreenHeadingText,
  Text,
} from '@wrappers/components';
import React from 'react';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

export const VerifyFailedScreen = ({ navigation, biometricType }) => {
  const intl = useIntl();
  const theme = useTheme();
  const onCancel = () => {
    navigation.goBack();
  };
  return (
    <Box justifyContent={'center'} mx={20} flex={1}>
      <ScreenHeadingText
        color={theme.modal.text}
        textAlign={'center'}
        fontSize={35}
        lineHeight={50}
      >
        {intl.formatMessage(
          {
            id: 'login.registerBiometrics.failed.title',
          },
          { biometricType },
        )}
      </ScreenHeadingText>
      <Text color={theme.modal.text} textAlign={'center'} fontSize={14} mt={60}>
        {intl.formatMessage({ id: 'login.registerBiometrics.failed.info' })}
      </Text>
      <Box mt={160}>
        <Button
          transparent
          buttonStyle={{ borderColor: theme.colors.white, borderWidth: 1 }}
          title={intl.formatMessage({
            id: 'login.registerBiometrics.buttonDismiss',
          })}
          onPress={onCancel}
        />
      </Box>
    </Box>
  );
};

export const VerifySuccessScreen = ({ navigation, biometricType, image }) => {
  const intl = useIntl();
  const theme = useTheme();
  const onCancel = () => {
    navigation.goBack();
  };
  return (
    <Box justifyContent={'center'} mx={20} flex={1}>
      <ScreenHeadingText
        color={theme.modal.text}
        textAlign={'center'}
        fontSize={35}
        lineHeight={50}
      >
        {intl.formatMessage(
          {
            id: 'login.registerBiometrics.verifySuccess',
          },
          { biometricType },
        )}
      </ScreenHeadingText>
      <Box py={20} alignItems={'center'}>
        <Image source={image} width={100} height={100} resizeMode="contain" />
      </Box>
      <Box mt={160}>
        <Button
          transparent
          buttonStyle={{ borderColor: theme.colors.white, borderWidth: 1 }}
          title={intl.formatMessage({
            id: 'login.registerBiometrics.buttonDismiss',
          })}
          onPress={onCancel}
        />
      </Box>
    </Box>
  );
};

export const VerifyingScreen = () => {
  const intl = useIntl();
  const theme = useTheme();
  return (
    <Box flex={1} justifyContent={'center'} alignItems={'center'}>
      <AnimatedEllipsis
        minOpacity={0.4}
        animationDelay={200}
        style={styles.loader(theme)}
      />

      <Text color={theme.modal.text}>
        {intl.formatMessage({ id: 'login.registerBiometrics.verifying' })}
      </Text>
    </Box>
  );
};

const styles = {
  loader: theme => ({
    fontSize: theme.fontSizes[9],
    letterSpacing: -20,
    marginTop: -20,
    color: theme.colors.gray[3],
  }),
};
