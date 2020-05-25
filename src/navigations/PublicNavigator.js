import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  LOGIN,
  FORGOT_PASSWORD,
  TERMS_CONDITIONS_MODAL,
  CONTACT_SCREEN,
  LANGUAGE_SETTING_SCREEN,
} from '@routes';
import {
  LoginScreen,
  ForgotPasswordScreen,
  ContactScreen,
  LanguageSettingScreen,
} from '@screens/Login';
import { ModalBackButton, StackBackButton } from '@wrappers/components';
import { useIntl } from '@wrappers/core/hooks';
import { TermsConditionsScreen } from '@screens/TermsConditions';

const Stack = createStackNavigator();

const PublicNavigator = () => {
  const intl = useIntl();

  return (
    <Stack.Navigator
      initialRouteName={LOGIN}
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <Stack.Screen
        name={LOGIN}
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
        options={{
          title: intl.formatMessage({
            id: 'forgotPassword.screenTitle',
          }),
          headerBackImage: StackBackButton,
        }}
      />
      <Stack.Screen
        name={TERMS_CONDITIONS_MODAL}
        component={TermsConditionsScreen}
        options={{
          title: intl.formatMessage({
            id: 'termsConditionsModalTitle',
          }),
          headerBackImage: ModalBackButton,
          ...TransitionPresets.ModalTransition,
        }}
      />
      <Stack.Screen
        name={CONTACT_SCREEN}
        component={ContactScreen}
        options={{
          title: intl.formatMessage({
            id: 'login.contact',
          }),
          headerTitleStyle: {
            fontWeight: '400',
            fontSize: 20,
          },
          headerBackImage: ModalBackButton,
        }}
      />
      <Stack.Screen
        name={LANGUAGE_SETTING_SCREEN}
        component={LanguageSettingScreen}
        options={{
          title: intl.formatMessage({
            id: 'profile.settings.language',
          }),
          headerBackImage: ModalBackButton,
        }}
      />
    </Stack.Navigator>
  );
};

export default PublicNavigator;
