import { configureMockStore } from '@testUtils';
import * as types from '@store/wallet/types';
import * as actions from '@store/wallet/actions';

describe('Wallet Actions', () => {
  test('should create actions to fetch wallet balance', async () => {
    const testResults = {
      member: {
        memberId: 3,
        balance: 999,
      },
      dependents: [
        {
          memberId: 4,
          balance: 123,
        },
      ],
    };
    const api = {
      fetchWallet: () =>
        Promise.resolve({
          data: testResults,
        }),
    };

    const store = configureMockStore(api)({
      user: { data: { clientId: 'twclient3', userId: 3 } },
    });

    const expectedActions = [
      { type: types.FETCH_WALLET_START },
      {
        type: types.FETCH_WALLET_SUCCESS,
        payload: testResults,
      },
    ];

    await store.dispatch(actions.fetchWallet());
    expect(store.getActions()).toEqual(expectedActions);
  });
});
