import React, { useRef } from 'react';
import { PUBLIC, LOGGED_IN, ACCEPT_TERMS_CONDITIONS_MODAL } from '@routes';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { trackScreenView } from '@store/analytics/trackingActions';
import { getActiveRouteName } from '@store/analytics/utils';
import { connect } from 'react-redux';
import PublicNavigator from '@navigations/PublicNavigator';
import HomeNavigator from './HomeNavigator';
import AcceptTCNavigator from './AcceptTCNavigator';

const Stack = createStackNavigator();

const RootNavigator = ({ isTermsAccepted, accessToken }) => {
  const routeNameRef = useRef();
  const navigationRef = useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={state => {
        const prevRouteName = routeNameRef.current;
        const crrRouteName = getActiveRouteName(state);
        if (prevRouteName !== crrRouteName) {
          trackScreenView(crrRouteName);
        }

        routeNameRef.current = crrRouteName;
      }}
    >
      <Stack.Navigator headerMode="none">
        {accessToken &&
        isTermsAccepted !== undefined &&
        isTermsAccepted !== null ? (
          !isTermsAccepted ? (
            <Stack.Screen
              name={ACCEPT_TERMS_CONDITIONS_MODAL}
              component={AcceptTCNavigator}
            />
          ) : (
            <Stack.Screen name={LOGGED_IN} component={HomeNavigator} />
          )
        ) : (
          <Stack.Screen name={PUBLIC} component={PublicNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = state => {
  const { isTermsAccepted, accessToken } = state.user;

  return { isTermsAccepted, accessToken };
};

export default connect(mapStateToProps)(RootNavigator);
