import {
  GET_DELIVERY_ADDRESSES,
  DELETE_DELIVERY_ADDRESS,
  ADD_DELIVERY_ADDRESS,
  UPDATE_DELIVERY_ADDRESS,
} from './types';

export const getDeliveryAddresses = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.getDeliveryAddresses(clientId, userId);

    return data;
  };

  return dispatch({
    type: GET_DELIVERY_ADDRESSES,
    payload: getPromise(),
  });
};

export const deleteDeliveryAddress = addressId => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.deleteDeliveryAddress(
      clientId,
      userId,
      addressId,
    );

    return data;
  };

  return dispatch({
    type: DELETE_DELIVERY_ADDRESS,
    payload: getPromise(),
    meta: { addressId },
  });
};

export const addDeliveryAddress = addressData => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId, membersMap } = getState().user;
    const user = membersMap[userId];
    const address = {
      ...addressData,
      telephone: user.contactNumber || '24124234', // TODO: why do we don't have these fields in address form
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const { data } = await api.addDeliveryAddress(clientId, userId, address);

    return data;
  };

  return dispatch({
    type: ADD_DELIVERY_ADDRESS,
    payload: getPromise(),
  });
};

export const updateDeliveryAddress = addressData => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.updateDeliveryAddress(
      clientId,
      userId,
      addressData.id,
      addressData,
    );

    return data;
  };

  return dispatch({
    type: UPDATE_DELIVERY_ADDRESS,
    payload: getPromise(),
  });
};
