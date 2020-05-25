import * as types from './types';

export const getTermsAndConditions = locale => (dispatch, _, { api }) => {
  const getPromise = async () => {
    const { data } = await api.getTermsAndConditions(locale);
    return data.content;
  };

  return dispatch({
    type: types.FETCH_TERMS_CONDITIONS,
    payload: getPromise(),
  });
};

export const getMyWellnessNewsletter = locale => (dispatch, _, { api }) => {
  const getPromise = async () => {
    const { data } = await api.getMyWellnessNewsletter(locale);
    return data.content;
  };

  return dispatch({
    type: types.FETCH_MYWELLNESS_NEWSLETTER,
    payload: getPromise(),
  });
};

export const getPrivacyPolicy = () => (dispatch, _, { api }) => {
  const getPromise = async () => {
    const { data } = await api.getPrivacyPolicy();
    return data.content;
  };

  return dispatch({
    type: types.FETCH_PRIVACY_POLICY,
    payload: getPromise(),
  });
};
