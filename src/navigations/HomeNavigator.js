import React from 'react';
import {
  REGISTER_BIOMETRIC_MODAL,
  TERMS_CONDITIONS_MODAL,
  TAB_NAVIGATOR,
} from '@routes';
import { useIntl } from '@wrappers/core/hooks';
import { createStackNavigator } from '@react-navigation/stack';
import { TermsConditionsScreen } from '@screens/TermsConditions';
import { RegisterBiometricScreen } from '@screens/Login';
import { ModalBackButton } from '@wrappers/components';
import { TabNavigator } from '@navigations';

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  const intl = useIntl();
  return (
    <HomeStack.Navigator mode="modal">
      <HomeStack.Screen
        name={TAB_NAVIGATOR}
        component={TabNavigator}
        options={{
          cardStyleInterpolator,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={REGISTER_BIOMETRIC_MODAL}
        component={RegisterBiometricScreen}
        options={{
          cardStyleInterpolator,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name={TERMS_CONDITIONS_MODAL}
        component={TermsConditionsScreen}
        options={{
          title: intl.formatMessage({
            id: 'termsConditionsModalTitle',
          }),
          headerBackTitleVisible: false,
          headerBackImage: ModalBackButton,
          cardStyleInterpolator,
        }}
      />
    </HomeStack.Navigator>
  );
};

const cardStyleInterpolator = ({ current: { progress } }) => ({
  cardStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    }),
  },
  overlayStyle: {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.85],
      extrapolate: 'clamp',
    }),
  },
});

export default HomeNavigator;
