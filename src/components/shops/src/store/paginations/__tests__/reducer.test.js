import reducer, { INITIAL_STATE } from '../reducer';
import {
  GET_PRODUCTS_START,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_PRODUCTS_BY_CATEGORY_ID_START,
  GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS,
  GET_PRODUCTS_BY_CATEGORY_ID_ERROR,
} from '@shops/store/home/types';

describe('Shop paginations reducer', () => {
  it('should return initial state when action is undefined', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(INITIAL_STATE);
  });

  it('should handle GET_PRODUCTS_START', () => {
    const expectedState = {
      ...INITIAL_STATE,
      products: {
        isLoading: true,
      },
    };

    const action = {
      type: GET_PRODUCTS_START,
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_SUCCESS', () => {
    const state = {
      ...INITIAL_STATE,
      products: {
        isLoading: true,
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        3: {
          page: 1,
          numberOfResults: 100,
          isLoading: false,
        },
        5: {
          page: 1,
          numberOfResults: 100,
          isLoading: false,
        },
      },
      products: {
        isLoading: false,
      },
    };

    const action = {
      type: GET_PRODUCTS_SUCCESS,
      meta: {
        categoryIds: [3, 5],
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_ERROR', () => {
    const state = {
      ...INITIAL_STATE,
      products: {
        isLoading: true,
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      products: {
        isLoading: false,
      },
    };

    const action = {
      type: GET_PRODUCTS_ERROR,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_BY_CATEGORY_ID_START', () => {
    const state = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 1,
          numberOfResults: 100,
          isLoading: false,
        },
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 1,
          numberOfResults: 100,
          isLoading: true,
        },
      },
    };

    const action = {
      type: GET_PRODUCTS_BY_CATEGORY_ID_START,
      meta: {
        categoryId: 1,
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS', () => {
    const state = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 1,
          numberOfResults: 100,
          isLoading: true,
        },
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 2,
          numberOfResults: 2,
          isLoading: false,
        },
      },
    };

    const action = {
      type: GET_PRODUCTS_BY_CATEGORY_ID_SUCCESS,
      meta: {
        categoryId: 1,
      },
      payload: {
        numberOfResults: 2,
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('should handle GET_PRODUCTS_BY_CATEGORY_ID_ERROR', () => {
    const state = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 1,
          numberOfResults: 100,
          isLoading: true,
        },
      },
    };

    const expectedState = {
      ...INITIAL_STATE,
      productsByCategoryId: {
        1: {
          page: 1,
          numberOfResults: 100,
          isLoading: false,
        },
      },
    };

    const action = {
      type: GET_PRODUCTS_BY_CATEGORY_ID_ERROR,
      meta: {
        categoryId: 1,
      },
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });
});
