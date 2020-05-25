import * as types from '../types';
import reducer from '../reducer';

Date.now = jest.fn(() => 1487076708000);

const initialState = {
  messages: { one: 'one' },
  locale: 'en-HK',
  initialNow: 1487076708000,
};

describe('claimType reducer', () => {
  it('should return the initialState', () => {
    const expectedState = initialState;

    expect(reducer(initialState, {})).toEqual(expectedState);
  });

  it('should handle SET_LOCALE', () => {
    const expectedState = {
      initialNow: 1487076708000,
      messages: { four: 'four', one: 'one', three: 'three' },
      locale: 'zh-cn',
    };
    const action = {
      type: types.SET_LOCALE,
      payload: {
        messages: { three: 'three', four: 'four' },
        locale: 'zh-cn',
      },
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
