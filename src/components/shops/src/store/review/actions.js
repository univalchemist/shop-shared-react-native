import { GET_REVIEW, GET_REVIEW_FORM,POST_REVIEW } from './types';

export const getReviews = productId => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;
    const { data } = await api.getReviews({
      clientId,
      productId,
    });
    return data;
  };

  return dispatch({
    type: GET_REVIEW,
    payload: getPromise(),
  });
};

export const getReviewForm = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;
    const { data } = await api.getReviewForm({
      clientId,
    });
    return data;
  };

  return dispatch({
    type: GET_REVIEW_FORM,
    payload: getPromise(),
  });
};
export const postReview = ({ orderId, sku, body }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const { data } = await api.postReview({
      clientId,
      userId,
      orderId,
      sku,
      body,
    });
    return data;
  };

  return dispatch({
    type: POST_REVIEW,
    payload: getPromise(),
  });
};
