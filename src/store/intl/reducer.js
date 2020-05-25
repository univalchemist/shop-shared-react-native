import { DEFAULT_LOCALE, MOMENT_LOCALE } from '@config/locale';
import { SET_LOCALE } from './types';
import { LOGIN_SUCCESS, GET_MEMBER_PROFILE_ERROR } from '../user/types';
import MESSAGES from '../../../messages';

const initialState = {
  intlLocale: DEFAULT_LOCALE,
  locale: DEFAULT_LOCALE,
  messages: MESSAGES[DEFAULT_LOCALE],
  momentLocale: MOMENT_LOCALE,
  initialNow: Date.now(),
  setLocaleCompleted: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCALE: {
      return {
        ...state,
        ...action.payload,
        messages: {
          ...state.messages,
          ...action.payload.messages,
        },
      };
    }

    case GET_MEMBER_PROFILE_ERROR:
    case LOGIN_SUCCESS: {
      return {
        ...state,
        setLocaleCompleted: false,
      };
    }

    default: {
      return state;
    }
  }
};
