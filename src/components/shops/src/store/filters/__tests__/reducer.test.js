import reducer, { INITIAL_STATE } from '../reducer';
import * as types from '../types';
import { GET_PRODUCTS_SUCCESS } from '@shops/store/home/types';

describe('Shop filters reducer', () => {
  it('should return initial state when action is undefined', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(INITIAL_STATE);
  });

  it('should handle UPDATE_SELECTED_CATEGORIES with valid action payload', () => {
    const expectedState = {
      ...INITIAL_STATE,
      params: {
        categoryId: [1, 2],
      },
      selectedCategories: [{ value: '1' }, { value: '2' }],
    };

    const action = {
      type: types.UPDATE_SELECTED_CATEGORIES,
      payload: [{ value: '1' }, { value: '2' }],
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_SELECTED_CATEGORIES without action payload', () => {
    const action = {
      type: types.UPDATE_SELECTED_CATEGORIES,
      payload: [],
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(INITIAL_STATE);
  });

  it('should handle UPDATE_SORT_TYPE with valid action payload', () => {
    const state = {
      ...INITIAL_STATE,
      sortType: 'bestselling-DESC',
      params: {
        categoryId: [1],
        sortType: 'bestselling',
        sortOrder: 'DESC',
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      sortType: 'price-ASC',
      params: {
        categoryId: [1],
        sortType: 'price',
        sortOrder: 'ASC',
      },
    };

    const action = {
      type: types.UPDATE_SORT_TYPE,
      payload: 'price-ASC',
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_SORT_TYPE without action payload', () => {
    const state = {
      ...INITIAL_STATE,
      sortType: 'bestselling-DESC',
      params: {
        categoryId: [1],
        sortType: 'bestselling',
        sortOrder: 'DESC',
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      sortType: undefined,
      params: {
        categoryId: [1],
      },
    };

    const action = {
      type: types.UPDATE_SORT_TYPE,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_FILTER_TYPES with valid payload', () => {
    const state = {
      ...INITIAL_STATE,
      filterTypes: {
        rangePrice: [0, 500],
      },
      params: {
        categoryId: [1],
        maximumPrice: 500,
        minimumPrice: 0,
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      filterTypes: {
        rangePrice: [1, 1000],
        ratings: true,
      },
      params: {
        categoryId: [1],
        maximumPrice: 1000,
        minimumPrice: 1,
        hasRating: 'true',
      },
    };

    const action = {
      type: types.UPDATE_FILTER_TYPES,
      payload: {
        rangePrice: [1, 1000],
        ratings: true,
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle UPDATE_FILTER_TYPES without action payload', () => {
    const state = {
      ...INITIAL_STATE,
      filterTypes: {
        rangePrice: [0, 500],
      },
      params: {
        categoryId: [1],
        maximumPrice: 500,
        minimumPrice: 0,
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      params: {
        categoryId: [1],
      },
    };

    const action = {
      type: types.UPDATE_FILTER_TYPES,
      payload: {},
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_SUCCESS', () => {
    const state = {
      ...INITIAL_STATE,
      params: {
        categoryId: [1, 3],
      },
    };

    const expectedState = {
      ...state,
      groupedProductSkus: {
        1: ['sku_1'],
        3: ['sku_2'],
      },
    };

    const action = {
      type: GET_PRODUCTS_SUCCESS,
      payload: {
        products: [
          {
            id: 1,
            categoryIds: [1],
            sku: 'sku_1',
          },
          {
            id: 2,
            categoryIds: [3],
            sku: 'sku_2',
          },
          {
            id: 3,
            categoryIds: [5],
            sku: 'sku_3',
          },
        ],
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });
});
