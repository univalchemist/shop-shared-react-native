import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-native-elements';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import configureStore from '@store/configureStore';
import IntlWrapper from '@components/IntlWrapper';
import { View, Text, Platform, StyleSheet } from 'react-native';
import JailMonkey from 'jail-monkey';
import FeatureToggle from '@config/FeatureToggle';
import { RootNavigator, FirebaseProvider } from '@navigations';
import { checkJailBroken } from '@utils';
import { enableScreens } from 'react-native-screens';

import init, { useSplashScreen, useInitLocale } from './init';
import theme from './theme';

const store = configureStore();

init();
enableScreens();

const App = () => {
  useSplashScreen();
  const { isAppReady } = useInitLocale(store);

  if (
    FeatureToggle.DETECT_ROOTED_DEVICE.on &&
    !__DEV__ &&
    (JailMonkey.isJailBroken() ||
      checkJailBroken() ||
      (JailMonkey.hookDetected() && Platform.OS === 'android'))
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.content}>
          App can not be used in rooted device.
        </Text>
      </View>
    );
  }

  return (
    isAppReady && (
      <Provider store={store}>
        <IntlWrapper>
          <ThemeProvider>
            <StyledThemeProvider theme={theme}>
              <FirebaseProvider>
                <RootNavigator />
              </FirebaseProvider>
            </StyledThemeProvider>
          </ThemeProvider>
        </IntlWrapper>
      </Provider>
    )
  );
};

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  content: {
    color: 'white',
    fontSize: 27,
    textAlign: 'center',
    width: '75%',
  },
});

export default App;
