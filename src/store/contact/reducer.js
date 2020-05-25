import * as types from './types';

const initialState = {
  details: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CONTACT_SUCCESS: {
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
