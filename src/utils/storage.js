import AsyncStorage from '@react-native-community/async-storage';

export const IS_LOGGED_IN_SSO = 'IS_LOGGED_IN_SSO';
export const LOGIN_STORAGE = 'login';
export const IS_FIRST_TIME_LOGIN = 'IS_FIRST_TIME_LOGIN';

export const get = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error(e);
  }
};

export const save = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};
