import jwtDecode from 'jwt-decode';
import { saveTokens, saveCredentials } from '@services/secureStore';
import * as Storage from './storage';

const saveSession = ({ clientId, username, password }) => async tokens => {
  const { id_token, access_token, expires_in } = tokens;
  const { sub } = jwtDecode(id_token);
  const userId = sub
    ? sub.includes('|')
      ? sub.split('|')[1]
      : sub
    : undefined;

  await Promise.all([
    saveCredentials(clientId, username, password),
    saveTokens(username, id_token, access_token, expires_in),
    Storage.save(Storage.LOGIN_STORAGE, JSON.stringify({ clientId, username })),
  ]);

  return { userId };
};

export default saveSession;
