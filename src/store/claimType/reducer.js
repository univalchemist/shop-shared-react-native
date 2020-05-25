import * as types from './types';

const initialState = {
  categories: {
    all: [],
    byId: {},
  },
  types: {
    byId: {},
  },
  reasons: {
    byId: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLAIM_TYPES_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
