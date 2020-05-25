import DocumentPicker from 'react-native-document-picker';
import { Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import * as ImageManipulator from 'expo-image-manipulator';
import uuid from 'uuid/v4';
import compressImage, {
  FILE_SIZE_LIMIT,
  FILE_SIZE_TOO_LARGE,
} from './compressImage';

async function openDocuments(intl, onSuccess, onError, onCancel) {
  const PDF_CONTENT = 'application/pdf';
  try {
    const file = await DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    });
    // IMAGES
    if (file.type !== PDF_CONTENT) {
      const fileUri = file.uri.replace(/%20/g, ' ');
      const fileExtension = fileUri.split('.').pop();
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.TemporaryDirectoryPath}/${uuid()}`
          : `${RNFS.TemporaryDirectoryPath}${uuid()}.${
              fileExtension ? fileExtension : 'jpg'
            }`;
      const newFileUri = `file://${filePath}`;
      await RNFS.copyFile(fileUri, filePath);

      const imageStats = await ImageManipulator.manipulateAsync(
        newFileUri,
        [],
        {
          format: 'jpeg',
        },
      );

      const compressedImage = await compressImage({
        fileName: file.name,
        uri: newFileUri,
        fileSize: file.size,
        width: imageStats.width,
        height: imageStats.height,
        type: file.type,
      });

      onSuccess && onSuccess(compressedImage);
      return;
    }

    // PDF
    if (file.size <= FILE_SIZE_LIMIT) {
      const fileUri = file.uri.replace(/%20/g, ' ');
      const fileExtension = fileUri.split('.').pop();
      const filePath =
        Platform.OS === 'android'
          ? `${RNFS.TemporaryDirectoryPath}/${uuid()}`
          : `${RNFS.TemporaryDirectoryPath}${uuid()}.${
              fileExtension ? fileExtension : 'pdf'
            }`;
      const newFileUri = `file://${filePath}`;
      await RNFS.copyFile(fileUri, filePath);

      onSuccess &&
        onSuccess({
          ...file,
          fileName: file.name,
          uri: newFileUri,
        });
    } else {
      throw Error(FILE_SIZE_TOO_LARGE);
    }
  } catch (e) {
    if (DocumentPicker.isCancel(e)) {
      onCancel && onCancel(e);
    } else {
      if (e.message === FILE_SIZE_TOO_LARGE) {
        Alert.alert(
          intl.formatMessage({ id: 'imagepicker.fileTooLarge' }),
          intl.formatMessage({
            id: `imagepicker.tryAnotherFile`,
          }),
        );
      }
      onError && onError(e);
    }
  }
}

export default openDocuments;
