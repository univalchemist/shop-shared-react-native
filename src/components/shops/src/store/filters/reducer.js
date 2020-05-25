import {
  UPDATE_SELECTED_CATEGORIES,
  UPDATE_SORT_TYPE,
  UPDATE_FILTER_TYPES,
  UPDATE_SEARCH_STRING,
} from './types';
import {
  GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS,
  GET_PRODUCTS_SUCCESS,
} from '../home/types';
import { FILTER_TYPES, PRODUCT_PARAMS } from '@shops/config/constants';

export const INITIAL_STATE = {
  selectedCategories: [],
  sortType: null,
  filterTypes: {},
  params: {},
  searchString: '',
  groupedProductSkus: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_CATEGORIES: {
      const params = { ...state.params };

      if (action.payload?.length) {
        params[PRODUCT_PARAMS.CATEGORY_ID] = action.payload.map(c =>
          parseInt(c.value, 10),
        );
      } else {
        return INITIAL_STATE;
      }

      return {
        ...state,
        params,
        selectedCategories: action.payload,
      };
    }
    case UPDATE_SORT_TYPE: {
      const params = { ...state.params };

      if (action.payload) {
        const sorts = action.payload.split('-');

        params[PRODUCT_PARAMS.SORT_TYPE] = sorts[0];
        params[PRODUCT_PARAMS.SORT_ORDER] = sorts[1];
      } else {
        delete params[PRODUCT_PARAMS.SORT_TYPE];
        delete params[PRODUCT_PARAMS.SORT_ORDER];
      }

      return {
        ...state,
        params,
        sortType: action.payload,
      };
    }
    case UPDATE_SEARCH_STRING: {
      const params = { ...state.params };
      console.log('UPDATE_SEARCH_STRING', action.payload);
      if (action.payload) {
        const searchString = action.payload;

        params[PRODUCT_PARAMS.SEARCH_STRING] = searchString;
      } else {
        delete params[PRODUCT_PARAMS.SEARCH_STRING];
      }
      return {
        ...state,
        params,
        searchString: action.payload,
      };
    }
    case UPDATE_FILTER_TYPES: {
      const params = { ...state.params };
      const filterTypes = action.payload;

      if (filterTypes[FILTER_TYPES.RATINGS]) {
        params[PRODUCT_PARAMS.HAS_RATING] = 'true';
      } else {
        delete params[PRODUCT_PARAMS.HAS_RATING];
      }

      if (filterTypes[FILTER_TYPES.RANGE_PRICE]) {
        params[PRODUCT_PARAMS.MINIMUM_PRICE] =
          filterTypes[FILTER_TYPES.RANGE_PRICE][0];
        params[PRODUCT_PARAMS.MAXIMUM_PRICE] =
          filterTypes[FILTER_TYPES.RANGE_PRICE][1];
      } else {
        delete params[PRODUCT_PARAMS.MINIMUM_PRICE];
        delete params[PRODUCT_PARAMS.MAXIMUM_PRICE];
      }

      return {
        ...state,
        params,
        filterTypes: action.payload,
      };
    }
    case GET_PRODUCTS_SUCCESS: {
      let groupedProductSkus = {};
      const parentProducts = action.payload;
      Object.keys(parentProducts).map(key => {
        const childProducts = parentProducts[key].products;
        groupedProductSkus = {
          ...groupedProductSkus,
          [key]: childProducts.map(p => p.sku),
        };
      });

      return { ...state, groupedProductSkus };
    }
    case GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS: {
      const { categoryId } = action.meta;
      const { products } = action.payload;
      const productsSku = products.map(p => p.sku);
      return {
        ...state,
        groupedProductSkus: {
          ...state.groupedProductSkus,
          [categoryId]: [
            ...state.groupedProductSkus[categoryId],
            ...productsSku,
          ],
        },
      };
    }

    default:
      return state;
  }
};
