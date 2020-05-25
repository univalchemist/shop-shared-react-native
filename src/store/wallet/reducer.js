import * as types from './types';

const initialState = {
  balanceMap: {},
  balanceTextMap: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_WALLET_SUCCESS: {
      const { member, dependents } = action.payload;
      const balanceMap = {};
      const balanceTextMap = {};
      const membersList = member ? [member, ...dependents] : dependents;
      membersList.forEach(({ memberId, balance, balanceText }) => {
        balanceMap[memberId] = balance;
        balanceTextMap[memberId] = balanceText;
      });

      return {
        ...state,
        balanceMap,
        balanceTextMap,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
