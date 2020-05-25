import * as types from './types';

export const fetchBenefits = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.fetchBenefits(clientId, userId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_BENEFITS,
    payload: getPromise(),
  });
};

export const fetchPolicyDetails = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.fetchPolicyDetails(clientId, userId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_POLICY_DETAILS,
    payload: getPromise(),
  });
};

export const fetchHealthCards = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.fetchHealthCards(clientId, userId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_HEALTHCARDS,
    payload: getPromise(),
  });
};

export const fetchDocuments = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;
    const response = await api.fetchDocuments(clientId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_BENEFIT_DOCUMENTS,
    payload: getPromise(),
  });
};
