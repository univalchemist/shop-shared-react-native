import * as types from './types';

const initialState = {
  documents: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DOCUMENTS_SUCCESS: {
      return {
        ...state,
        documents: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
