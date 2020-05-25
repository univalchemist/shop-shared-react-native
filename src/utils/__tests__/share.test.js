import Share from 'react-native-share';
import { Alert } from 'react-native';
import api from '@services/api';
import RNFetchBlob from 'rn-fetch-blob';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { shareDocumentIOS, shareDocumentAndroid } from '../share';

jest.mock('@services/api', () => ({
  getAuthHeaders: jest.fn(),
}));

jest.mock('rn-fetch-blob', () => {
  const flushSpy = jest.fn().mockResolvedValue();
  const fetchSpy = jest.fn().mockResolvedValue({
    readFile: jest.fn(() => 'base64Data'),
    flush: flushSpy,
    path: jest.fn(() => 'filePath'),
  });

  return {
    config: jest.fn(() => ({
      path: 'http://www.test.com',
      fileCache: true,
      fetch: fetchSpy,
    })),
    fs: { dirs: { DocumentDir: jest.fn() } },
    fetchSpy,
    flushSpy,
  };
});

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

describe('share document functionality', () => {
  const intl = {
    formatMessage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call Share functionality when ios function is triggered', async () => {
    api.getAuthHeaders.mockResolvedValueOnce({
      Authorization: 'Bearer abcd12345',
    });
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };

    const options = {
      type,
      url: 'filePath',
    };

    await shareDocumentIOS(docArguments);
    expect(Share.open).toHaveBeenCalledTimes(1);
    expect(Share.open).toHaveBeenCalledWith(options);
    expect(api.getAuthHeaders).toHaveBeenCalledTimes(1);
    expect(RNFetchBlob.fetchSpy).toHaveBeenCalledWith(
      'GET',
      'http://www.hello.com/doc.pdf',
      { Authorization: 'Bearer abcd12345' },
    );
  });

  it('should call Share functionality when android function is triggered', async () => {
    api.getAuthHeaders.mockResolvedValueOnce({
      Authorization: 'Bearer abcd12345',
    });
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    const expected = {
      url: `data:application/pdf;base64,base64Data`,
    };

    await shareDocumentAndroid(docArguments);
    expect(Share.open).toHaveBeenCalledTimes(1);
    expect(Share.open).toHaveBeenCalledWith(expected);
    expect(RNFetchBlob.fetchSpy).toHaveBeenCalledWith(
      'GET',
      'http://www.hello.com/doc.pdf',
      { Authorization: 'Bearer abcd12345' },
    );
  });

  it('should invoke an alert when there is an error handling opening of ios sharing sheet', async () => {
    Share.open.mockImplementation(() => {
      throw Error('Problem');
    });
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentIOS(docArguments);

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should invoke an alert when there is an error handling opening of android sharing sheet', async () => {
    Share.open.mockImplementation(() => {
      throw Error('Problem');
    });
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentAndroid(docArguments);

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should invoke an alert when there is an error fetching the pdf document on android', async () => {
    RNFetchBlob.fetchSpy.mockRejectedValueOnce(Error('Problem'));
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentAndroid(docArguments);
    await flushMicrotasksQueue();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should invoke an alert when there is an error fetching the pdf document on ios', async () => {
    RNFetchBlob.fetchSpy.mockRejectedValueOnce(Error('Problem'));
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentIOS(docArguments);
    await flushMicrotasksQueue();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should not invoke an alert when error is USER_DID_NOT_SHARE for android', async () => {
    Share.open.mockRejectedValueOnce(Error('User did not share'));
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentAndroid(docArguments);

    expect(Alert.alert).toHaveBeenCalledTimes(0);
  });

  it('should not invoke an alert when error is USER_DID_NOT_SHARE for IOS', async () => {
    Share.open.mockRejectedValueOnce(Error('User did not share'));
    const url = 'http://www.hello.com/doc.pdf';
    const type = 'application/pdf';
    const docArguments = {
      url,
      type,
      intl,
    };
    await shareDocumentIOS(docArguments);
    expect(Alert.alert).toHaveBeenCalledTimes(0);
  });
});
