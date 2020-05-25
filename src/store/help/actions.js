import * as types from './types';

export const fetchHelpContent = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;
    const response = await api.fetchHelpContent(clientId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_HELP,
    payload: getPromise(),
  });
};
