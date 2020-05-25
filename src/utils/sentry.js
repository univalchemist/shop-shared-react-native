import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

if (!__DEV__) {
  Sentry.init({
    dsn: Config.MOBILE_SENTRY_DSN,
    environment: Config.ENVIRONMENT,
  });
}

export const captureError = err => {
  return Sentry.captureException(err);
};

export const captureMessage = msg => {
  return Sentry.captureMessage(msg);
};

export const testJsCrash = () => {
  throw new Error('My first Sentry error!');
};

export const testNativeCrash = () => {
  Sentry.nativeCrash();
};
