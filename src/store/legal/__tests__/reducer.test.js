import reducer from '../reducer';
import * as types from '../types';

const initialState = reducer(undefined, {});

describe('legal reducer', () => {
  it('should return the initialState', () => {
    const expectedState = {
      termsAndConditions: null,
      privacyPolicy: null,
    };
    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle FETCH_TERMS_CONDITIONS_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      termsAndConditions: 'terms and conditions content',
    };

    const action = {
      type: types.FETCH_TERMS_CONDITIONS_SUCCESS,
      payload: 'terms and conditions content',
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle FETCH_PRIVACY_POLICY_SUCCESS', () => {
    const expectedState = {
      ...initialState,
      privacyPolicy: 'privacy policy content',
    };

    const action = {
      type: types.FETCH_PRIVACY_POLICY_SUCCESS,
      payload: 'privacy policy content',
    };

    expect(reducer(undefined, action)).toEqual(expectedState);
  });
});
