import {
  GET_STORE_CONFIGS,
  GET_CATEGORIES,
  GET_SORTINGS,
  GET_COUNTRIES,
} from './types';

export const getStoreConfigs = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;

    const { data } = await api.getStoreConfigs(clientId);
    return data && data[0];
  };

  return dispatch({
    type: GET_STORE_CONFIGS,
    payload: getPromise(),
  });
};

export const getCategories = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;

    const { data } = await api.getCategories(clientId);
    return data && data[0];
  };

  return dispatch({
    type: GET_CATEGORIES,
    payload: getPromise(),
  });
};

export const getSortings = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;

    const { data } = await api.getSortings(clientId);
    return data;
  };

  return dispatch({
    type: GET_SORTINGS,
    payload: getPromise(),
  });
};

export const getCountries = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;

    const { data } = await api.getCountries(clientId);
    return data;
  };

  return dispatch({
    type: GET_COUNTRIES,
    payload: getPromise(),
  });
};
