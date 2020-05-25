import reducer from '@store/wallet/reducer';
import * as types from '@store/wallet/types';

describe('Wallet Reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { type: 'ANY' })).toEqual({
      balanceMap: {},
      balanceTextMap: {},
    });
  });

  test('should set wallet details on FETCH_WALLET_SUCCESS', () => {
    const testData = {
      member: {
        memberId: 3,
        balance: 999,
        balanceText: '$HK999',
      },
      dependents: [
        {
          memberId: 4,
          balance: 123,
          balanceText: '$HK123',
        },
      ],
    };
    expect(
      reducer(
        {},
        {
          type: types.FETCH_WALLET_SUCCESS,
          payload: testData,
        },
      ),
    ).toEqual({
      balanceMap: {
        3: 999,
        4: 123,
      },
      balanceTextMap: {
        3: '$HK999',
        4: '$HK123',
      },
    });
  });

  test('should set wallet for dependent even if member doesnt have balance on FETCH_WALLET_SUCCESS', () => {
    const testData = {
      member: null,
      dependents: [
        {
          memberId: 4,
          balance: 123,
          balanceText: '$HK123',
        },
      ],
    };
    expect(
      reducer(
        {},
        {
          type: types.FETCH_WALLET_SUCCESS,
          payload: testData,
        },
      ),
    ).toEqual({
      balanceMap: {
        4: 123,
      },
      balanceTextMap: {
        4: '$HK123',
      },
    });
  });
});
