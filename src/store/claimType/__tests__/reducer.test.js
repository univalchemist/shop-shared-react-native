import reducer from '../reducer';
import * as types from '../types';

describe('consultationType reducer', () => {
  it('should return the initialState', () => {
    const expectedState = {
      categories: { byId: {}, all: [] },
      types: { byId: {} },
      reasons: { byId: {} },
    };

    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle FETCH_CLAIM_TYPES_SUCCESS', () => {
    const expectedState = {
      categories: { byId: {}, all: [] },
      types: { byId: {} },
      reasons: { byId: {} },
    };
    const action = {
      type: types.FETCH_CLAIM_TYPES_SUCCESS,
      payload: {
        categories: { byId: {}, all: [] },
        types: { byId: {} },
        reasons: { byId: {} },
      },
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
