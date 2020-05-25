import { Platform } from 'react-native';
import { fetchTokens } from '../../services/secureStore';
import { Storage } from '@utils';
import uuid from 'uuid';

export const buildWebSource = async (loginUri, startingUri, redirectUrl) => {
  const state = uuid().replace(/-/g, '');

  const isLoggedInShopSso = await Storage.get(Storage.IS_LOGGED_IN_SSO);
  if (isLoggedInShopSso === 'true') {
    return { uri: startingUri };
  }

  const redirect_url = redirectUrl || startingUri;

  const { id_token, access_token } = await fetchTokens();
  const bodyString = `id_token=${id_token}&access_token=${access_token}&is_redirect_url=true&cookiestate=${state}&redirect_url=${redirect_url}&expires_in=86400`;
  const source =
    Platform.OS === 'android'
      ? {
          uri: loginUri,
          body: bodyString,
          method: 'POST',
        }
      : {
          uri: loginUri,
          body: JSON.stringify({
            id_token,
            access_token,
            redirect_url,
            cookiestate: state,
            is_redirect_url: true,
            expires_in: 86400,
          }),

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        };

  return source;
};
