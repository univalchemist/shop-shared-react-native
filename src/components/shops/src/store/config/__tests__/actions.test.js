import { configureMockStore } from '@testUtils';
import { STORE_CONFIGS, CATEGORY_TREE, SORTINGS } from '@shops/__mocks__/data';
import * as actions from '../actions';
import * as types from '../types';

const api = {
  getStoreConfigs: () => ({
    data: [STORE_CONFIGS],
  }),
  getCategories: () => ({
    data: [CATEGORY_TREE],
  }),
  getSortings: () => ({
    data: SORTINGS,
  }),
  getCountries: () => ({
    data: [
      {
        id: 'SG',
        abbreviation: 'SG',
        name: 'Singapore',
      },
    ],
  }),
};

describe('Shop config actions', () => {
  it('should create an action to get store configs', () => {
    const initialState = { user: { clientId: 'cxadev' } };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_STORE_CONFIGS_START },
      {
        type: types.GET_STORE_CONFIGS_SUCCESS,
        payload: STORE_CONFIGS,
      },
    ];

    return store.dispatch(actions.getStoreConfigs()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get categories', () => {
    const initialState = { user: { clientId: 'cxadev' } };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_CATEGORIES_START },
      {
        type: types.GET_CATEGORIES_SUCCESS,
        payload: CATEGORY_TREE,
      },
    ];

    return store.dispatch(actions.getCategories()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get sortings', () => {
    const initialState = { user: { clientId: 'cxadev' } };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_SORTINGS_START },
      {
        type: types.GET_SORTINGS_SUCCESS,
        payload: SORTINGS,
      },
    ];

    return store.dispatch(actions.getSortings()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get countries', () => {
    const initialState = { user: { clientId: 'cxadev' } };
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_COUNTRIES_START },
      {
        type: types.GET_COUNTRIES_SUCCESS,
        payload: [
          {
            id: 'SG',
            abbreviation: 'SG',
            name: 'Singapore',
          },
        ],
      },
    ];

    return store.dispatch(actions.getCountries()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
