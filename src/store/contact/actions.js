import * as types from './types';

export const fetchContactContent = clientId => async (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const response = await api.fetchContactContent(clientId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_CONTACT,
    payload: getPromise(),
  });
};
