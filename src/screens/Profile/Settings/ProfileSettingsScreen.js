import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useIntl } from '@wrappers/core/hooks';
import {
  PROFILE_TERMS_CONDITIONS_SCREEN,
  PROFILE_LANGUAGE_SETTINGS,
  PROFILE_PRIVACY_POLICY_SCREEN,
  PROFILE_COMMUNICATION_SCREEN,
  BIOMETRIC_SETTING_SCREEN,
} from '@routes';
import {
  Box,
  AppVersion,
  ListItemWithRightChevron,
  Text,
  Loader,
  TrackedButton,
  Container,
  ScrollView,
} from '@wrappers/components';
import { connect } from 'react-redux';
import { logout, resetPassword } from '@store/user/actions';
import { debounceAlert } from '@utils';
import { categories, logAction } from '@store/analytics/trackingActions';
import { useBiometrics, getBiometricDeviceType } from '@utils';
import FeatureToggle from '@config/FeatureToggle';

const ProfileSettingsScreen = ({ logout, resetPassword, navigation }) => {
  let intl = useIntl();
  const { biometryType } = useBiometrics();
  let settings = [
    {
      label: intl.formatMessage({ id: 'profile.settings.resetPassword' }),
      route: null,
      handle: 'resetPassword',
    },
    {
      label: intl.formatMessage({ id: 'profile.settings.language' }),
      route: PROFILE_LANGUAGE_SETTINGS,
    },

    {
      label: intl.formatMessage({ id: 'profile.settings.communication' }),
      route: PROFILE_COMMUNICATION_SCREEN,
    },
    {
      label: intl.formatMessage({ id: 'profile.settings.termsConditions' }),
      route: PROFILE_TERMS_CONDITIONS_SCREEN,
    },
    {
      label: intl.formatMessage({ id: 'profile.settings.privacyPolicy' }),
      route: PROFILE_PRIVACY_POLICY_SCREEN,
    },
  ];

  if (FeatureToggle.USE_BIOMETRICS.on) {
    const biometricDeviceType = getBiometricDeviceType();
    let biometricId = `profile.settings.${
      biometryType ? biometryType : biometricDeviceType
    }`;
    settings.splice(2, 0, {
      label: intl.formatMessage({ id: biometricId }),
      route: BIOMETRIC_SETTING_SCREEN,
    });
  }

  const [isLoading, setLoading] = useState(false);
  const pressHandle = {
    resetPassword: async function() {
      setLoading(true);
      try {
        const action = await resetPassword();
        setLoading(false);
        debounceAlert({
          subject: intl.formatMessage({ id: 'forgotPassword.successTitle' }),
          message: intl.formatMessage(
            { id: 'forgotPassword.successText' },
            { email: action.value },
          ),
        });
      } catch (err) {
        setLoading(false);
        debounceAlert({
          subject: intl.formatMessage({ id: 'errorPanel.title' }),
          message: intl.formatMessage({ id: 'errorPanel.message' }),
        });
      }
      logAction({
        category: categories.PROFILE_SETTINGS,
        action: 'Reset password',
      });
    },
  };
  return isLoading ? (
    <Loader />
  ) : (
    <ScrollView>
      <FlatList
        data={settings}
        keyExtractor={item => item.route}
        renderItem={({ item: { label, route, handle } }) => (
          <ListItemWithRightChevron
            onPress={() => {
              if (route) {
                if (route === BIOMETRIC_SETTING_SCREEN) {
                  navigation.navigate(route, { biometricName: label });
                } else {
                  navigation.navigate(route);
                }
              } else if (handle) {
                pressHandle[handle]();
              }
            }}
            accessible={true}
            accessibilityLabel={label}
          >
            <Text>{label}</Text>
          </ListItemWithRightChevron>
        )}
      />
      <Container>
        <TrackedButton
          secondary
          title={intl.formatMessage({ id: 'logoutButtonText' })}
          onPress={() => {
            logout();
          }}
          actionParams={{
            category: categories.PROFILE_SETTINGS,
            action: 'Log out',
          }}
        />
        <Box alignItems="center" mt={4}>
          <AppVersion />
        </Box>
      </Container>
    </ScrollView>
  );
};

export default connect(null, { logout, resetPassword })(ProfileSettingsScreen);
