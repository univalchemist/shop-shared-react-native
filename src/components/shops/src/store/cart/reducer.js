import {
  GET_CART_SUCCESS,
  GET_CART_TOTALS_SUCCESS,
  REMOVE_ITEM_FROM_CART_SUCCESS,
  ADD_TO_CART_SUCCESS,
} from './types';

export const INITIAL_STATE = {
  isActive: false,
  itemsCount: 0,
  itemsQty: 0,
  items: [],
  totals: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TO_CART_SUCCESS:
    case GET_CART_SUCCESS:
    case REMOVE_ITEM_FROM_CART_SUCCESS: {
      const { items, itemsCount, itemsQty, isActive } = action.payload;

      return {
        ...state,
        items,
        itemsCount,
        itemsQty,
        isActive,
      };
    }

    case GET_CART_TOTALS_SUCCESS: {
      return {
        ...state,
        totals: action.payload,
      };
    }

    default:
      return state;
  }
};
