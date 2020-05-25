import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

const api = {
  fetchHelpContent: () => ({
    data: {
      details: {
        email: 'foo@bar.com',
        phone: '+9876543210',
        customerSupportHours: 'foo bar baz',
      },
    },
  }),
};

describe('Content actions', () => {
  it('should create an action to fetch Help Content', () => {
    const initialState = {};
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_HELP_START },
      {
        type: types.FETCH_HELP_SUCCESS,
        payload: {
          details: {
            email: 'foo@bar.com',
            phone: '+9876543210',
            customerSupportHours: 'foo bar baz',
          },
        },
      },
    ];

    return store.dispatch(actions.fetchHelpContent()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
