import * as types from './types';
import { setLocale } from '@store/intl/actions';
import { clearClinics } from '@store/panel/actions';
import { Storage, saveSession } from '@utils';
import { DEFAULT_LOCALE } from '@config/locale';

export const login = (
  { clientname: clientId, username, password },
  after = () => {},
) => (dispatch, _, { api }) => {
  const getPromise = async () => {
    const { data } = await api.login({ clientId, username, password });
    const { userId } = await saveSession({ clientId, username, password })(
      data,
    );
    Storage.save(Storage.IS_LOGGED_IN_SSO, 'false');

    return {
      clientId,
      userId,
      username,
      accessToken: data.access_token,

      // only for callback
      // after login success
      // not save
      after,
    };
  };

  return dispatch({
    type: types.LOGIN,
    payload: getPromise(),
  });
};

export const resendEmail = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    return api.resendEmail(clientId, userId);
  };

  return dispatch({
    type: types.RESEND_EMAIL,
    payload: getPromise(),
  });
};

export const getBalance = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    return await api.getMemberBalance(clientId, userId);
  };

  return dispatch({
    type: types.GET_MEMBER_BALANCE,
    payload: getPromise(),
  });
};

export const getMemberProfile = value => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = value || getState().user;
    const { data } = await api.fetchMemberProfile(clientId, userId);

    const preferredLocale = await Storage.get('preferredLocale');
    dispatch(updateMemberProfile(preferredLocale ?? DEFAULT_LOCALE, true));

    return {
      ...data,
      preferredLocale,
    };
  };

  return dispatch({
    type: types.GET_MEMBER_PROFILE,
    payload: getPromise(),
  });
};

export const updateLastlogin = ({ clientId, userId }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const memberProfile = {
      clientId,
      memberId: userId,
      updateLogin: true,
    };

    await api.updateMemberProfile(clientId, userId, memberProfile);
  };

  return dispatch({
    type: types.UPDATE_LAST_LOGIN,
    payload: getPromise(),
  });
};

export const logout = () => (dispatch, getState) => {
  const { clientId, userId } = getState().user;

  return dispatch({ type: types.LOGOUT, payload: { clientId, userId } });
};

export const updateMemberProfile = (preferredLocale, setLocaleCompleted) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const memberProfile = {
      clientId,
      memberId: userId,
      preferredLocale,
    };

    await api.updateMemberProfile(clientId, userId, memberProfile);
    dispatch(clearClinics());
    dispatch(setLocale(preferredLocale, setLocaleCompleted));

    return memberProfile;
  };
  return dispatch({
    type: types.UPDATE_MEMBER_PROFILE,
    payload: getPromise(),
  });
};

export const agreeTermsConditions = (isTermsAccepted, isEdmOptedOut) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const memberProfile = {
      clientId,
      memberId: userId,
      isEdmOptedOut,
      isTermsAccepted,
    };
    await api.updateMemberProfile(clientId, userId, memberProfile);

    return memberProfile;
  };
  return dispatch({
    type: types.UPDATE_AGREEMENT_TERMS_CONDITIONS,
    payload: getPromise(),
  });
};

export const updateEdmOptedOut = isEdmOptedOut => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const memberProfile = {
      clientId,
      memberId: userId,
      isEdmOptedOut,
    };
    await api.updateMemberProfile(clientId, userId, memberProfile);

    return memberProfile;
  };

  return dispatch({
    type: types.UPDATE_EDM_OPTED_OUT,
    payload: getPromise(),
  });
};

export const resetPassword = () => (dispatch, _) => {
  const getPromise = async () => {
    try {
      const loginInfo = await Storage.get(Storage.LOGIN_STORAGE);
      if (loginInfo) {
        const { clientId, username } = JSON.parse(loginInfo);
        await dispatch(forgotPassword({ clientId, username }));
        return username;
      } else {
        throw null;
      }
    } catch (err) {
      throw err;
    }
  };
  return dispatch({
    type: types.RESETPASSWORD,
    payload: getPromise(),
  });
};

export const forgotPassword = ({ clientId, username }) => (
  dispatch,
  _,
  { api },
) => {
  const getPromise = async () => {
    await api.forgotPassword({ clientId, username });
  };
  return dispatch({
    type: types.FORGOTPASSWORD,
    payload: getPromise(),
  });
};

export const updateDependentDoB = ({ dependentId, dateOfBirth }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async ({ user }) => {
    const { clientId, userId } = user;
    await api.updateDependentDoB({
      clientId,
      dependentId,
      dateOfBirth,
      employeeId: userId,
    });
  };

  return dispatch({
    type: types.UPDATE_DEPENDENT_DATE_OF_BIRTH,
    payload: getPromise(getState()),
  });
};

export const sendInvitationToDependent = ({ dependentId, emailId }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async ({ user }) => {
    const { clientId, userId } = user;
    await api.sendInvitationToDependent({
      clientId,
      dependentId,
      emailId,
      employeeId: userId,
    });
  };

  return dispatch({
    type: types.SEND_DEPENDENT_INVITE,
    payload: getPromise(getState()),
  });
};
