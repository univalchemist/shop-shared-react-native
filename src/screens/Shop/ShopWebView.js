import React, { memo, useRef, useEffect } from 'react';
import WebView from 'react-native-webview';
import Config from 'react-native-config';
import { useSelector } from 'react-redux';
import { Storage } from '@utils';
import { Linking } from 'react-native';

export const ShopWebView = (
  { source, clientId, isAuthorized, setIsAuthorized, onUnAuthorized },
  ref,
) => {
  const openExternalLinkTypeByShop = 'OpenExternalLink';
  let latestUrl = '';
  const preferredLocale = useSelector(state => state.intl.locale);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (isAuthorized) {
      // ignore reload when run in test
      if (!process.env.JEST_WORKER_ID) {
        webViewRef.current.reload();
      }
    }
  }, [preferredLocale]);

  return (
    <WebView
      ref={webViewRef}
      containerStyle={{
        flex: 0,
        height: isAuthorized ? '100%' : 0,
      }}
      onLoadStart={({ nativeEvent }) => {
        const { url } = nativeEvent;

        if (url.includes(clientId) || url.includes('sso/email')) {
          setIsAuthorized(true);
          Storage.save(Storage.IS_LOGGED_IN_SSO, 'true');
        }
      }}
      source={source}
      originWhitelist={['*']}
      onShouldStartLoadWithRequest={request => {
        const { url } = request;
        const isMailToLink = url.startsWith('mailto:');
        const isTelephoneLink = url.startsWith('tel:');

        if (isTelephoneLink || isMailToLink) {
          Linking.canOpenURL(url).then(supported => {
            if (supported) {
              Linking.openURL(url);
            }
          });
          return false;
        }

        const getUnauthorizedError = url.includes('sso/unauthorize');
        if (getUnauthorizedError) {
          setIsAuthorized(false);

          Storage.save(Storage.IS_LOGGED_IN_SSO, 'false').then(() => {
            onUnAuthorized(latestUrl);
          });
          return false;
        }

        if (
          url.includes(Config.SHOP_URL) &&
          url !== latestUrl &&
          !url.includes('customer/account/logout') &&
          !url.includes('sso/unauthorize') &&
          !url.includes('sso/email') &&
          !url.includes('sso/token/receive')
        ) {
          latestUrl = url;
        }

        return true;
      }}
      onMessage={event => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === openExternalLinkTypeByShop) {
          Linking.openURL(data.url);
        }
      }}
    />
  );
};

export default memo(ShopWebView);
