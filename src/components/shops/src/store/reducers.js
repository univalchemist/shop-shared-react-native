/* istanbul ignore file */

import { combineReducers } from 'redux';
import HomeReducer from './home/reducer';
import FiltersReducer from './filters/reducer';
import ConfigReducer from './config/reducer';
import ReviewReducer from './review/reducer';
import CartReducer from './cart/reducer';
import PaginationsReducer from './paginations/reducer';
import OrderHistoryReducer from './orderhistory/reducer';
import DeliveryAddressReducer from './deliveryAddress/reducer';

export default combineReducers({
  home: HomeReducer,
  filters: FiltersReducer,
  config: ConfigReducer,
  review: ReviewReducer,
  cart: CartReducer,
  paginations: PaginationsReducer,
  orderHistory: OrderHistoryReducer,
  deliveryAddress: DeliveryAddressReducer,
});
