import reducer from '../reducer';
import * as types from '../types';

describe('Contact reducer', () => {
  it('should handle FETCH_CONTACT_SUCCESS', () => {
    const initialState = {};
    const expectedState = {
      details: {
        email: 'foo@bar.com',
        phone: '+9876543210',
        customerSupportHours: 'foo bar baz',
      },
    };

    const action = {
      type: types.FETCH_CONTACT_SUCCESS,
      payload: {
        details: {
          email: 'foo@bar.com',
          phone: '+9876543210',
          customerSupportHours: 'foo bar baz',
        },
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
