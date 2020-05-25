import { GET_ORDER_DETAIL_SUCCESS, GET_ORDER_HISTORY_SUCCESS } from './types';

export const INITIAL_STATE = {
  orderHistory: [],
  orderDetail: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ORDER_HISTORY_SUCCESS:
      const orderHistory = action.payload;
      return {
        ...state,
        orderHistory,
      };

    case GET_ORDER_DETAIL_SUCCESS: {
      const orderDetail = action.payload;
      return {
        ...state,
        orderDetail,
      };
    }
    default:
      return state;
  }
};
