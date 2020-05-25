import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import api from '@services/api';

const USER_DID_NOT_SHARE = 'User did not share';

export const shareDocumentIOS = async ({ url, type, intl, customFilename }) => {
  const authHeaders = await api.getAuthHeaders();
  let response = null;
  try {
    const filename = customFilename || url.split('/').pop();
    const configOptions = {
      fileCache: true,
      path: `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`,
    };
    response = await RNFetchBlob.config(configOptions).fetch(
      'GET',
      url,
      authHeaders,
    );
    const filePath = response.path();
    const options = {
      type,
      url: filePath,
    };
    await Share.open(options);
  } catch (e) {
    if (e.message !== USER_DID_NOT_SHARE) {
      Alert.alert(
        intl.formatMessage({ id: 'error' }),
        intl.formatMessage({ id: 'globalDefaultErrorMessage' }),
      );
    }

    if (response) {
      await response.flush();
    }
  }
};

export const shareDocumentAndroid = async ({ url, type, intl }) => {
  const authHeaders = await api.getAuthHeaders();
  let response = null;
  try {
    const configOptions = { fileCache: true };
    response = await RNFetchBlob.config(configOptions).fetch(
      'GET',
      url,
      authHeaders,
    );
    const base64Data = await response.readFile('base64');
    const finalBase64Data = `data:${type};base64,${base64Data}`;
    await Share.open({ url: finalBase64Data });
  } catch (e) {
    if (e.message !== USER_DID_NOT_SHARE) {
      Alert.alert(
        intl.formatMessage({ id: 'error' }),
        intl.formatMessage({ id: 'globalDefaultErrorMessage' }),
      );
    }
  }
  if (response) {
    await response.flush();
  }
};
