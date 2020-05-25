import { Alert, Platform, Linking } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import getImageFromImagePicker from '../getImageFromImagePicker';
import compressImage from '../compressImage';
import getDocumentFromDocumentPicker from '../getDocumentFromDocumentPicker';

jest.mock('../compressImage', () => jest.fn());
jest.mock('../getDocumentFromDocumentPicker', () => jest.fn());

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  showImagePicker: jest.fn(),
}));

describe('getImageFromImagePicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call onSuccess upon successful selection of image', async () => {
    const img = {
      fileSize: 1234,
      uri: `fileuri`,
      type: 'image/jpeg',
      fileName: 'xxx',
    };

    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback(img);
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onSuccess: jest.fn(),
    };

    compressImage.mockResolvedValueOnce(img);

    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    expect(params.onSuccess).toHaveBeenCalled();
  });

  it('should call onCancel when user cancels selection', async () => {
    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback({
        didCancel: true,
      });
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onCancel: jest.fn(),
    };

    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    expect(params.onCancel).toHaveBeenCalled();
  });

  it('should call onError when photo is too large', async () => {
    const img = {
      fileSize: 1234,
      uri: `fileuri`,
      type: 'image/jpeg',
      fileName: 'xxx',
    };

    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback(img);
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    compressImage.mockRejectedValueOnce('Image file size is too big');
    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    expect(Alert.alert).toHaveBeenCalled();
    expect(params.onError).toHaveBeenCalled();
  });

  it('should call onError when permission not granted on iOS', async () => {
    Platform.OS = 'ios';
    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback({
        error: 'Photo library permissions not granted',
      });
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    const goToSettingsAlertOption = Alert.alert.mock.calls[0][2][1];
    goToSettingsAlertOption.onPress();

    expect(Alert.alert).toHaveBeenCalled();
    expect(Linking.openURL).toHaveBeenCalled();
    expect(params.onError).toHaveBeenCalled();
  });

  it('should call onError when there is error in picking image', async () => {
    Platform.OS = 'ios';
    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback({
        error: 'Some error',
      });
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    expect(Alert.alert).toHaveBeenCalled();
    expect(params.onError).toHaveBeenCalled();
  });

  it('should call openDocuments when the custom button is pressed', async () => {
    ImagePicker.showImagePicker.mockImplementationOnce((_, callback) => {
      callback({
        customButton: true,
      });
    });

    const params = {
      intl: { formatMessage: jest.fn() },
      onError: jest.fn(),
    };

    getImageFromImagePicker(params);
    await flushMicrotasksQueue();

    expect(getDocumentFromDocumentPicker).toHaveBeenCalled();
  });
});
