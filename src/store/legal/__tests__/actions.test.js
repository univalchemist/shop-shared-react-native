import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

const api = {
  getTermsAndConditions: () => ({
    data: {
      content: 'terms and conditions content',
    },
  }),
  getPrivacyPolicy: () => ({
    data: {
      content: 'privacy policy content',
    },
  }),
};

describe('legal actions', () => {
  it('should create an action to get terms and conditions', () => {
    const store = configureMockStore(api)();
    const expectedActions = [
      { type: types.FETCH_TERMS_CONDITIONS_START },
      {
        type: types.FETCH_TERMS_CONDITIONS_SUCCESS,
        payload: 'terms and conditions content',
      },
    ];

    return store.dispatch(actions.getTermsAndConditions()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create an action to get privacy policy', () => {
    const store = configureMockStore(api)();
    const expectedActions = [
      { type: types.FETCH_PRIVACY_POLICY_START },
      {
        type: types.FETCH_PRIVACY_POLICY_SUCCESS,
        payload: 'privacy policy content',
      },
    ];

    return store.dispatch(actions.getPrivacyPolicy()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
