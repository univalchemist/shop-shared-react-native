import { useState, useEffect } from 'react';
import { YellowBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from '@react-native-community/geolocation';
import { setLocale } from '@store/intl/actions';
import { Storage } from '@utils';
import 'moment/min/locales';

const SPLASHSCREEN_DELAY = 800;
const IS_DEV = process.env.NODE_ENV === 'development';

export const useInitLocale = store => {
  const { dispatch } = store;
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function initLocale() {
      const preferredLocale = await Storage.get('preferredLocale');

      if (preferredLocale) {
        await dispatch(setLocale(preferredLocale));
      }

      setIsAppReady(true);
    }

    initLocale();
  }, [dispatch]);

  return { isAppReady, setIsAppReady };
};

export const useSplashScreen = () => {
  useEffect(() => {
    const timer = setTimeout(() => SplashScreen.hide(), SPLASHSCREEN_DELAY);

    return () => clearTimeout(timer);
  }, []);
};

export default (config = {}) => {
  const {
    debug = IS_DEV,
    ignoreWarnings = [
      'Native TextInput',
      'Warning: componentWillReceiveProps',
      'Warning: componentWillUpdate',
      'Remote debugger is in a background tab which may cause apps to perform slowly',
    ],
  } = config;

  navigator.geolocation = Geolocation;

  // to see network request on debugger
  if (debug) {
    GLOBAL.XMLHttpRequest =
      GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;
  }

  YellowBox.ignoreWarnings(ignoreWarnings);
};
