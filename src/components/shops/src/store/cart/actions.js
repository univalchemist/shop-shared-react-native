import {
  ADD_TO_CART,
  GET_CART,
  GET_CART_BILLING,
  GET_CART_SHIPPING,
  GET_CART_TOTALS,
  REMOVE_ITEM_FROM_CART,
} from './types';

export const addToCart = ({ sku, quantity }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.addToCart({
      clientId,
      userId,
      sku,
      quantity,
    });
    return data;
  };

  return dispatch({
    type: ADD_TO_CART,
    payload: getPromise(),
  });
};

export const getCart = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.getCart(clientId, userId);
    return data;
  };

  return dispatch({
    type: GET_CART,
    payload: getPromise(),
  });
};

export const getCartTotals = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.getCartTotals(clientId, userId);
    return data;
  };

  return dispatch({
    type: GET_CART_TOTALS,
    payload: getPromise(),
  });
};

export const getCartBilling = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.getCartBilling(clientId, userId);
    return data;
  };

  return dispatch({
    type: GET_CART_BILLING,
    payload: getPromise(),
  });
};

export const getCartShipping = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.getCartShipping(clientId, userId);
    return data;
  };

  return dispatch({
    type: GET_CART_SHIPPING,
    payload: getPromise(),
  });
};

export const removeItemFromCart = sku => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { userId, clientId } = getState().user;
    const { data } = await api.removeItemFromCart(clientId, userId, sku);
    return data;
  };

  return dispatch({
    type: REMOVE_ITEM_FROM_CART,
    payload: getPromise(),
  });
};
