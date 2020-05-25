import { GET_ORDER_HISTORY, GET_ORDER_DETAIL, GET_TRACK_ORDER } from './types';

export const getOrderHistory = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.getOrdersHistory({ clientId, userId });
    return data;
  };

  return dispatch({
    type: GET_ORDER_HISTORY,
    payload: getPromise(),
  });
};

export const getOrderDetail = orderId => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.getOrderDetail({ clientId, userId, orderId });
    return data;
  };

  return dispatch({
    type: GET_ORDER_DETAIL,
    payload: getPromise(),
  });
};

export const getTrackOrder = orderId => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.getTrackOrder({ clientId, userId, orderId });
    return data;
  };

  return dispatch({
    type: GET_TRACK_ORDER,
    payload: getPromise(),
  });
};
