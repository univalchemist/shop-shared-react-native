import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ACCEPT_TERMS_CONDITIONS_SCREEN,
  MYWELLNESS_NEWSLETTER_SCREEN,
} from '@routes';
import { StackBackButton } from '@wrappers/components';
import { useIntl } from '@wrappers/core/hooks';
import {
  MyWellnessNewsletterScreen,
  AcceptTermsConditionsScreen,
} from '@screens/TermsConditions';

const Stack = createStackNavigator();

const AcceptTCNavigator = () => {
  const intl = useIntl();

  return (
    <Stack.Navigator
      initialRouteName={ACCEPT_TERMS_CONDITIONS_SCREEN}
      screenOptions={{ headerBackTitleVisible: false }}
    >
      <Stack.Screen
        name={ACCEPT_TERMS_CONDITIONS_SCREEN}
        component={AcceptTermsConditionsScreen}
        options={{
          title: intl.formatMessage({ id: 'termsConditionsModalTitle' }),
        }}
      />
      <Stack.Screen
        name={MYWELLNESS_NEWSLETTER_SCREEN}
        component={MyWellnessNewsletterScreen}
        options={({ route }) => ({
          title: route.params?.myWellnessNewsletterTitle,
          headerBackImage: StackBackButton,
        })}
      />
    </Stack.Navigator>
  );
};

export default AcceptTCNavigator;
