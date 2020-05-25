import {
  saveTokens,
  saveShopTokens,
  fetchTokens,
  clearTokens,
  saveCredentials,
  fetchCredentials,
  clearCredentials,
} from '../secureStore';
import {
  getGenericPassword,
  setGenericPassword,
  resetGenericPassword,
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
} from 'react-native-keychain';
import { flushMicrotasksQueue } from 'react-native-testing-library';

describe('saveTokens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should save id_token and access_token for a user', async () => {
    const email = 'test3@test.com';
    const id_token = 'myidtoken';
    const access_token = 'myaccesstoken';
    const expectedSecret = JSON.stringify({ id_token, access_token });
    setGenericPassword.mockImplementationOnce(
      () => new Promise(resolve => resolve(true)),
    );

    const success = await saveTokens(email, id_token, access_token);

    expect(success).toBeTruthy();
    expect(setGenericPassword).toHaveBeenCalledTimes(1);
    expect(setGenericPassword).toHaveBeenCalledWith(
      email,
      expectedSecret,
      null,
    );
  });
});

describe('saveShopTokens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should save integration_token and customer_token for a user', async () => {
    const email = 'test3@test.com';
    const id_token = 'myidtoken';
    const access_token = 'myaccesstoken';
    const expires_in = 'myexpiresin';
    const integration_token = 'myintegrationtoken';
    const customer_token = 'mycustomertoken';
    const expectedSecret = JSON.stringify({
      integration_token,
      customer_token,
    });

    setGenericPassword.mockImplementationOnce(
      () => new Promise(resolve => resolve(true)),
    );

    getGenericPassword.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          resolve({
            id_token,
            access_token,
            expires_in,
          }),
        ),
    );

    const success = await saveShopTokens(
      email,
      integration_token,
      customer_token,
    );

    expect(success).toBeTruthy();
    expect(setGenericPassword).toHaveBeenCalledTimes(1);
    expect(setGenericPassword).toHaveBeenCalledWith(
      email,
      expectedSecret,
      null,
    );
  });
});

describe('fetchTokens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should retrieve id_token and access_token for a user', async () => {
    const email = 'test3@test.com';
    const id_token = 'myidtoken';
    const access_token = 'myaccesstoken';
    const storedPassword = JSON.stringify({ id_token, access_token });
    getGenericPassword.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          resolve({ username: email, password: storedPassword }),
        ),
    );

    const fetchedTokens = await fetchTokens();
    expect(getGenericPassword).toHaveBeenCalledTimes(1);
    expect(fetchedTokens.id_token).toEqual(id_token);
    expect(fetchedTokens.access_token).toEqual(access_token);
  });

  it('returns undefined id_token and access_token when not found in store', async () => {
    getGenericPassword.mockImplementationOnce(
      () => new Promise(resolve => resolve(false)),
    );

    const { id_token, access_token } = await fetchTokens();

    expect(getGenericPassword).toHaveBeenCalledTimes(1);
    expect(id_token).toBeUndefined();
    expect(access_token).toBeUndefined();
  });
});

describe('clearTokens', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should clear tokens', async () => {
    resetGenericPassword.mockImplementationOnce(
      () => new Promise(resolve => resolve(true)),
    );

    const success = await clearTokens();

    expect(success).toBeTruthy();
    expect(resetGenericPassword).toHaveBeenCalledTimes(1);
  });
});

describe('saveCredentials', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should save username and password for given clientId', async () => {
    const clientId = 'client3';
    const username = 'myusername';
    const password = 'password';
    setInternetCredentials.mockImplementationOnce(
      () => new Promise(resolve => resolve()),
    );
    expect(
      saveCredentials(clientId, username, password),
    ).resolves.toBeUndefined();
    await flushMicrotasksQueue();
    expect(setInternetCredentials).toHaveBeenCalledTimes(1);
    expect(setInternetCredentials).toHaveBeenCalledWith(
      clientId,
      username,
      password,
      null,
    );
  });
});

describe('fetchCredentials', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should resolves username and password for given clientId', async () => {
    const clientId = 'client3';
    getInternetCredentials.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          resolve({ username: 'testusername', password: 'password' }),
        ),
    );
    expect(fetchCredentials(clientId)).resolves.toEqual({
      username: 'testusername',
      password: 'testpassword',
    });
    expect(getInternetCredentials).toHaveBeenCalledTimes(1);
    expect(getInternetCredentials).toHaveBeenCalledWith(clientId);
  });

  it('should resolves to false when unable to find credentials for given clientId', async () => {
    const clientId = 'client3';
    getInternetCredentials.mockImplementationOnce(
      () => new Promise(resolve => resolve(false)),
    );
    expect(fetchCredentials(clientId)).resolves.toEqual(false);
    expect(getInternetCredentials).toHaveBeenCalledTimes(1);
    expect(getInternetCredentials).toHaveBeenCalledWith(clientId);
  });
});

describe('clearCredentials', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should resetInternetCredentials', async () => {
    resetInternetCredentials.mockImplementationOnce(
      () => new Promise(resolve => resolve(true)),
    );

    const success = await clearCredentials();

    expect(success).toBeTruthy();
    expect(resetInternetCredentials).toHaveBeenCalledTimes(1);
  });
});
