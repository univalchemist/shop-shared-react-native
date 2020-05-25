import { getMemberMapAndOrder } from '@utils';
import * as types from './types';
import { DEFAULT_LOCALE } from '@config/locale';

const initialState = {
  preferredLocale: DEFAULT_LOCALE,
  membersProfileOrder: [],
  membersMap: {},
  unterminatedMembersMap: {},
  clientId: null,
  username: null,
  firstName: null,
  userId: null,
  role: null,
  isEdmOptedOut: false,
  category: null,
  status: null,
  accessToken: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      const { clientId, userId, username, accessToken } = action.payload;

      return {
        ...state,
        clientId,
        userId,
        username,
        accessToken,
      };
    }

    case types.LOGOUT: {
      return {
        ...state,
        accessToken: null,
        isTermsAccepted: null,
      };
    }

    case types.GET_MEMBER_PROFILE_SUCCESS: {
      const res = action.payload;

      const { clientId, preferredLocale, ...memberProfile } = res;
      const {
        membersMap,
        membersProfileOrder,
        unterminatedMembersMap,
      } = getMemberMapAndOrder(memberProfile);

      return {
        ...state,
        clientId,
        category: res.category,
        status: res.status,
        isTermsAccepted: res.isTermsAccepted,
        isEdmOptedOut: res.isEdmOptedOut,
        role: res.role,
        firstName: res.firstName,
        preferredLocale,
        membersMap,
        membersProfileOrder,
        unterminatedMembersMap,
      };
    }

    case types.UPDATE_MEMBER_PROFILE_SUCCESS: {
      return {
        ...state,
        preferredLocale: action.payload.preferredLocale,
      };
    }

    case types.UPDATE_AGREEMENT_TERMS_CONDITIONS_SUCCESS: {
      const payload = action.payload;
      return {
        ...state,
        isTermsAccepted: payload.isTermsAccepted,
        isEdmOptedOut: payload.isEdmOptedOut,
      };
    }

    case types.UPDATE_EDM_OPTED_OUT_ERROR:
    case types.UPDATE_EDM_OPTED_OUT_START: {
      return {
        ...state,
        isEdmOptedOut: !state.isEdmOptedOut,
      };
    }

    case types.UPDATE_EDM_OPTED_OUT_SUCCESS: {
      const payload = action.payload;
      return {
        ...state,
        isEdmOptedOut: payload.isEdmOptedOut,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
