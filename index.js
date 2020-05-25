/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './src/index';
import '@utils/sentry';
import { name as appName } from './app.json';

if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en');
}

AppRegistry.registerComponent(appName, () => App);
