import reducer, { INITIAL_STATE } from '../reducer';
import {
  STORE_CONFIGS,
  CURRENCY,
  CATEGORY_TREE,
  SORTINGS,
} from '@shops/__mocks__/data';
import * as types from '../types';

describe('Shop config reducer', () => {
  it('should return initial state when action is undefined', () => {
    expect(reducer(undefined, { type: 'INIT' })).toEqual(INITIAL_STATE);
  });

  it('should handle GET_STORE_CONFIGS_SUCCESS', () => {
    const expectedState = {
      ...INITIAL_STATE,
      storeConfigs: STORE_CONFIGS,
      currency: CURRENCY,
    };

    const action = {
      type: types.GET_STORE_CONFIGS_SUCCESS,
      payload: STORE_CONFIGS,
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });

  it('should handle GET_SORTINGS_SUCCESS', () => {
    const expectedState = {
      ...INITIAL_STATE,
      sortings: {
        'bestselling-DESC': SORTINGS[0],
        'price-DESC': SORTINGS[1],
        'price-ASC': SORTINGS[2],
        'discount-DESC': SORTINGS[3],
        'discount-ASC': SORTINGS[4],
      },
    };

    const action = {
      type: types.GET_SORTINGS_SUCCESS,
      payload: SORTINGS,
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });

  it('should handle GET_CATEGORIES_SUCCESS', () => {
    const expectedState = {
      ...INITIAL_STATE,
      categoryTree: CATEGORY_TREE,
      categories: [
        {
          label: 'All products',
          title: '',
          titleValue: '2',
          value: '2',
        },
        {
          label: 'All alternative medicine',
          title: 'Alternative medicine',
          titleValue: '3',
          value: '4',
        },
        {
          label: 'TCM',
          title: 'Alternative medicine',
          titleValue: '3',
          value: '5',
        },
        {
          label: 'Homeopathy',
          title: 'Alternative medicine',
          titleValue: '3',
          value: '6',
        },
      ],
    };

    const action = {
      type: types.GET_CATEGORIES_SUCCESS,
      payload: CATEGORY_TREE,
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });

  it('should handle GET_COUNTRIES_SUCCESS', () => {
    const expectedState = {
      ...INITIAL_STATE,
      countryIds: ['SG'],
      countryMap: {
        SG: {
          id: 'SG',
          abbreviation: 'SG',
          name: 'Singapore',
        },
      },
    };

    const action = {
      type: types.GET_COUNTRIES_SUCCESS,
      payload: [
        {
          id: 'SG',
          abbreviation: 'SG',
          name: 'Singapore',
        },
      ],
    };

    expect(reducer(INITIAL_STATE, action)).toEqual(expectedState);
  });
});
