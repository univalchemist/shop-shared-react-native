import { keyBy } from 'lodash';
import {
  GET_DELIVERY_ADDRESSES_SUCCESS,
  DELETE_DELIVERY_ADDRESS_SUCCESS,
  ADD_DELIVERY_ADDRESS_SUCCESS,
  UPDATE_DELIVERY_ADDRESS_SUCCESS,
} from './types';

export const INITIAL_STATE = {
  addressIds: [],
  addressMap: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DELIVERY_ADDRESSES_SUCCESS:
    case ADD_DELIVERY_ADDRESS_SUCCESS:
    case UPDATE_DELIVERY_ADDRESS_SUCCESS:
      const addressMap = keyBy(action.payload, p => p.id);
      const addressIds = action.payload.map(p => p.id);

      return {
        ...state,
        addressIds,
        addressMap,
      };

    case DELETE_DELIVERY_ADDRESS_SUCCESS:
      const { addressId } = action.meta;
      return {
        ...state,
        addressIds: state.addressIds.filter(p => p !== addressId),
      };

    default:
      return state;
  }
};
