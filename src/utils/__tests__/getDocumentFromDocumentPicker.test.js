import RNFS from 'react-native-fs';
import * as ImageManipulator from 'expo-image-manipulator';
import DocumentPicker from 'react-native-document-picker';
import compressImage from '../compressImage';
import getDocumentFromDocumentPicker from '../getDocumentFromDocumentPicker';
import { Alert } from 'react-native';
import uuid from 'uuid/v4';

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  isCancel: jest.fn(),
  types: 'image/*',
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: 'base64',
}));

jest.mock('../compressImage', () => {
  const originalModule = jest.requireActual('../compressImage');
  return {
    __esModule: true,
    default: jest.fn(),
    FILE_SIZE_LIMIT: originalModule.FILE_SIZE_LIMIT,
    FILE_SIZE_TOO_LARGE: originalModule.FILE_SIZE_TOO_LARGE,
  };
});

describe('getDocumentFromDocumentPicker', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should trigger onSuccess handler for pdf document', async () => {
    DocumentPicker.pick.mockResolvedValueOnce({
      uri: 'fileuri.pdf',
      type: 'application/pdf',
      name: 'test1.pdf',
      size: 200,
    });
    uuid.mockReturnValueOnce('dummy-dummy');
    RNFS.copyFile.mockResolvedValueOnce();

    const params = {
      intl: { formatMessage: jest.fn() },
      onSuccess: jest.fn(),
    };

    await getDocumentFromDocumentPicker(params.intl, params.onSuccess);

    expect(DocumentPicker.pick).toHaveBeenCalled();
    expect(params.onSuccess).toHaveBeenCalledWith({
      fileName: 'test1.pdf',
      name: 'test1.pdf',
      size: 200,
      type: 'application/pdf',
      uri: 'file:///tmpdummy-dummy.pdf',
    });
  });

  it('should allow users to pick images', async () => {
    DocumentPicker.pick.mockResolvedValueOnce({
      uri: 'fileuri.jpg',
      type: 'image/jpeg',
      name: 'img1.jpg',
      size: 200,
    });
    uuid.mockReturnValueOnce('dummy-dummy');
    RNFS.copyFile.mockResolvedValueOnce();
    ImageManipulator.manipulateAsync.mockResolvedValueOnce({
      width: 1024,
      height: 960,
    });
    compressImage.mockResolvedValueOnce({
      size: 200,
      fileName: 'img1.jpg',
      type: 'image/jpeg',
      uri: 'file://tmpblablabla.jpg',
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onSuccess: jest.fn(),
    };

    await getDocumentFromDocumentPicker(params.intl, params.onSuccess);

    expect(compressImage).toHaveBeenCalledWith({
      fileName: 'img1.jpg',
      uri: 'file:///tmpdummy-dummy.jpg',
      fileSize: 200,
      width: 1024,
      height: 960,
      type: 'image/jpeg',
    });
    expect(DocumentPicker.pick).toHaveBeenCalled();
    expect(params.onSuccess).toHaveBeenCalledWith({
      size: 200,
      fileName: 'img1.jpg',
      type: 'image/jpeg',
      uri: 'file://tmpblablabla.jpg',
    });
  });

  it('should display alert when PDF file size is above limit', async () => {
    DocumentPicker.pick.mockResolvedValueOnce({
      uri: 'fileuri',
      type: 'application/pdf',
      name: 'test1.pdf',
      size: 4097152,
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    await getDocumentFromDocumentPicker(params.intl, params.onError);

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should catch error when an error occurs picking document', async () => {
    DocumentPicker.pick.mockRejectedValueOnce(Error('error'));
    DocumentPicker.isCancel.mockImplementationOnce(() => false);

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    await getDocumentFromDocumentPicker(params.intl, params.onError);

    expect(Alert.alert).toHaveBeenCalledTimes(0);
  });

  it('should cancel handler when cancel is pressed', async () => {
    DocumentPicker.pick.mockRejectedValueOnce('File size too large');
    DocumentPicker.isCancel.mockImplementationOnce(() => true);

    const params = {
      intl: { formatMessage: jest.fn() },
      onCancel: jest.fn(),
    };

    await getDocumentFromDocumentPicker(params.intl, params.onCancel);

    expect(DocumentPicker.isCancel).toHaveBeenCalled();
  });
});
