import * as types from '@store/wallet/types';

export const fetchWallet = () => {
  return (dispatch, getState, { api }) => {
    const getResponse = async () => {
      const { clientId, userId } = getState().user;
      const response = await api.fetchWallet({
        clientId,
        userId,
      });
      return response.data;
    };

    return dispatch({
      type: types.FETCH_WALLET,
      payload: getResponse(),
    });
  };
};
