import { keyBy } from 'lodash';
import {
  GET_SUGGESTED_PRODUCTS_SUCCESS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCT_BY_SKU_SUCCESS,
  GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS,
} from './types';

export const INITIAL_STATE = {
  suggestedProductSkus: [],
  productMap: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SUGGESTED_PRODUCTS_SUCCESS:
      const { products } = action.payload;
      const productMap = keyBy(products, p => p.sku);
      return {
        ...state,
        suggestedProductSkus: [
          ...state.suggestedProductSkus,
          ...products.map(p => p.sku),
        ],
        productMap: {
          ...state.productMap,
          ...productMap,
        },
      };

    case GET_PRODUCTS_SUCCESS: {
      const products = action.payload;
      let productMap = {};
      Object.keys(products).map(key => {
        const productChildMap = keyBy(products[key].products, p => p.sku);
        productMap = {
          ...productMap,
          ...productChildMap,
        };
      });
      return {
        ...state,
        productMap: {
          ...state.productMap,
          ...productMap,
        },
      };
    }

    case GET_PRODUCT_BY_SKU_SUCCESS: {
      const product = action.payload;
      return {
        ...state,
        productMap: {
          ...state.productMap,
          [product.sku]: product,
        },
      };
    }
    case GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS: {
      const { products } = action.payload;
      const productKeyBy = keyBy(products,p=>p.sku);

      return {
        ...state,
        productMap: {
          ...state.productMap,
          ...productKeyBy,
        },
      };
    }

    default:
      return state;
  }
};
