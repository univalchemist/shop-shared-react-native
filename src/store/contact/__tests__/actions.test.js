import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';

const api = {
  fetchContactContent: () => ({
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
  it('should create an action to fetch Contact Content', () => {
    const initialState = {};
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_CONTACT_START },
      {
        type: types.FETCH_CONTACT_SUCCESS,
        payload: {
          details: {
            email: 'foo@bar.com',
            phone: '+9876543210',
            customerSupportHours: 'foo bar baz',
          },
        },
      },
    ];

    return store.dispatch(actions.fetchContactContent()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
