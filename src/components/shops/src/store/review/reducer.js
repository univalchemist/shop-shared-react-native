import { GET_REVIEW_SUCCESS } from './types';

const INITIAL_STATE = {
  currentReviews: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REVIEW_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
