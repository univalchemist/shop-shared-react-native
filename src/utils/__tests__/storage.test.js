import mockAsyncStorage from '@react-native-community/async-storage';
import * as Storage from '../storage';

describe('Storage', () => {
  it('should retrieve value of key', async () => {
    jest.spyOn(mockAsyncStorage, 'getItem').mockResolvedValue('some-value');

    const response = await Storage.get('key');

    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('key');
    expect(response).toEqual('some-value');
  });

  it('should save value of key', async () => {
    jest.spyOn(mockAsyncStorage, 'setItem').mockResolvedValue(null);

    await Storage.save('key', 'some value');

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('key', 'some value');
  });

  it('should log the error if retrieval of value returns rejected promise', async () => {
    jest.spyOn(mockAsyncStorage, 'getItem').mockRejectedValue('error');
    const mockConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await Storage.get('key');

    expect(mockConsole.mock.calls[0][0]).toEqual('error');
  });

  it('should log the error if saving of value returns rejected promise', async () => {
    jest.spyOn(mockAsyncStorage, 'setItem').mockRejectedValue('error');
    const mockConsole = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await Storage.save('key', 'value');

    expect(mockConsole.mock.calls[0][0]).toEqual('error');
  });
});
