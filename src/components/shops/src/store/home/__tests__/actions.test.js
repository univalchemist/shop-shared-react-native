import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

const products = [
  {
    id: 1,
    name: 'Product A',
    sku: 'product_A',
  },
  {
    id: 2,
    name: 'Product B',
    sku: 'product_B',
  },
];

const payload = {
  numberOfResults: 2,
  products,
};

const api = {
  getSuggestedOffers: () => ({
    data: {
      numberOfResults: 2,
      products,
    },
  }),
  getProducts: () => ({
    data: {
      numberOfResults: 2,
      products,
    },
  }),
  getProductsByCategoryId: () => ({
    data: {
      numberOfResults: 2,
      products,
    },
  }),
  getProductBySku: (_, sku) => {
    return {
      data: products.find(p => p.sku === sku),
    };
  },
};

describe('Shop config actions', () => {
  it('should create an action to get home data', () => {
    const initialState = { user: { clientId: 'cxadev' } };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_SUGGESTED_PRODUCTS_START },
      {
        type: types.GET_SUGGESTED_PRODUCTS_SUCCESS,
        payload,
      },
    ];

    return store.dispatch(actions.getHomeData()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get products', () => {
    const initialState = {
      user: { clientId: 'cxadev' },
      shop: { filters: { params: { categoryId: [1, 2] } } },
    };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      {
        type: types.GET_PRODUCTS_START,
        meta: {
          categoryIds: [1, 2],
        },
      },
      {
        type: types.GET_PRODUCTS_SUCCESS,
        payload,
        meta: {
          categoryIds: [1, 2],
        },
      },
    ];

    return store.dispatch(actions.getProducts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get products by category id', () => {
    const initialState = {
      user: { clientId: 'cxadev' },
      shop: {
        paginations: {
          productsByCategoryId: {
            1: { page: 1 },
          },
        },
        filters: {
          params: {},
        },
      },
    };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      {
        type: types.GET_PRODUCTS_BY_CATEGORY_ID_START,
        meta: {
          categoryId: 1,
        },
      },
      {
        type: types.GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS,
        payload,
        meta: {
          categoryId: 1,
        },
      },
    ];

    return store.dispatch(actions.getProductsByCategoryId(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get products by sku', () => {
    const initialState = {
      user: { clientId: 'cxadev' },
      shop: {},
    };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      {
        type: types.GET_PRODUCT_BY_SKU_START,
      },
      {
        type: types.GET_PRODUCT_BY_SKU_SUCCESS,
        payload: {
          id: 2,
          name: 'Product B',
          sku: 'product_B',
        },
      },
    ];

    return store.dispatch(actions.getProductBySku('product_B')).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
