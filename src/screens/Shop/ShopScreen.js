import React, { useEffect, useState } from 'react';
import Config from 'react-native-config';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { Box, Loader } from '@wrappers/components';
import { useSelector } from 'react-redux';
import { useIntl } from '@wrappers/core/hooks';
import { buildWebSource } from './utils';
import ShopWebView from './ShopWebView';

const ShopScreen = ({ route }) => {
  const intl = useIntl();
  const { url } = route?.params || {};

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [webSource, setWebSource] = useState(null);

  const { clientId } = useSelector(state => state.user);

  const startingUri = url || `${Config.SHOP_URL}/${clientId}`;
  const loginUri = `${Config.SHOP_URL}/sso/token/receive?platform=${Platform.OS}`;

  useEffect(() => {
    const init = async () => {
      const source = await buildWebSource(loginUri, startingUri);

      setWebSource(source);
    };

    init();
  }, [loginUri, startingUri]);

  const onUnAuthorized = async redirectUrl => {
    const source = await buildWebSource(loginUri, startingUri, redirectUrl);

    setWebSource(source);
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <>
        {!isAuthorized && (
          <Box
            height="100%"
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Loader
              primary
              loadingText={intl.formatMessage({
                id: 'shop.loading.login',
                defaultMessage: 'Logging you into the shop',
              })}
            />
          </Box>
        )}
        <ShopWebView
          source={webSource}
          clientId={clientId}
          isAuthorized={isAuthorized}
          setIsAuthorized={setIsAuthorized}
          onUnAuthorized={onUnAuthorized}
        />
      </>
    </SafeAreaView>
  );
};

export default ShopScreen;
