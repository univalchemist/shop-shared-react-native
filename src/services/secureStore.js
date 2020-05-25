import { Platform } from 'react-native';
import {
  setGenericPassword,
  resetGenericPassword,
  getGenericPassword,
  setInternetCredentials,
  resetInternetCredentials,
  getInternetCredentials,
  getSupportedBiometryType,
  ACCESS_CONTROL,
} from 'react-native-keychain';

const overridedSetGenericPassword = async (username, password) => {
  const options =
    Platform.OS === 'android'
      ? {
          accessControl: ACCESS_CONTROL.USER_PRESENCE,
        }
      : null;
  return await setGenericPassword(username, password, options);
};

const saveTokens = async (username, id_token, access_token, expires_in) => {
  const password = JSON.stringify({ id_token, access_token, expires_in });
  return await overridedSetGenericPassword(username, password);
};

const fetchTokens = async () => {
  const { password, username } = await getGenericPassword();
  return password ? { ...JSON.parse(password), username } : {};
};

// Shop
const saveShopTokens = async (username, integration_token, customer_token) => {
  const { id_token, access_token, expires_in } = await fetchTokens();
  const password = JSON.stringify({
    id_token,
    access_token,
    expires_in,
    // shop tokens
    integration_token,
    customer_token,
  });

  return await overridedSetGenericPassword(username, password);
};

const clearTokens = async () => {
  return await resetGenericPassword();
};

/**
 * Stores the username and password under clientId
 * @param {string} clientId
 * @param {string} username
 * @param {string} password
 */
const saveCredentials = async (clientId, username, password) => {
  try {
    const options =
      Platform.OS === 'android'
        ? {
            accessControl: ACCESS_CONTROL.APPLICATION_PASSWORD,
          }
        : null;
    return await setInternetCredentials(clientId, username, password, options);
  } catch (e) {}
};

/**
 * @typedef {Object} Credentials
 * @property {string} username - The username
 * @property {string} password - The password
 */
/**
 * Gets the username and password stored for given clientId as key
 * @param {string} clientId
 * @return {Credentials} The credentials for the given clientId
 */
const fetchCredentials = async clientId => {
  return await getInternetCredentials(clientId);
};

const clearCredentials = async clientId => {
  return await resetInternetCredentials(clientId);
};

const checkBiometricAvailability = async () => {
  return await getSupportedBiometryType();
};

export {
  overridedSetGenericPassword,
  saveTokens,
  fetchTokens,
  clearTokens,
  saveCredentials,
  fetchCredentials,
  clearCredentials,
  saveShopTokens,
  checkBiometricAvailability,
};
