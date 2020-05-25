import ImagePicker from 'react-native-image-picker';
import { Platform, Alert, Linking } from 'react-native';
import compressImage, { FILE_SIZE_TOO_LARGE } from './compressImage';
import getDocumentFromDocumentPicker from './getDocumentFromDocumentPicker';

function getImageFromImagePicker({
  intl,
  onSuccess,
  onError,
  onCancel,
  withDocuments = false,
}) {
  const permissionDenied = {
    title: intl.formatMessage({
      id: 'imagepicker.permissionDenied.title',
    }),

    text: intl.formatMessage({
      id: 'imagepicker.permissionDenied.text',
    }),

    settings: intl.formatMessage({
      id: 'imagepicker.permissionDenied.settingsTitle',
    }),

    notNow: intl.formatMessage({
      id: 'imagepicker.permissionDenied.notNowTitle',
    }),
  };

  ImagePicker.showImagePicker(
    {
      title: null,
      cancelButtonTitle: intl.formatMessage({
        id: 'imagepicker.cancelButtonTitle',
      }),
      takePhotoButtonTitle: intl.formatMessage({
        id: 'imagepicker.takePhotoButtonTitle',
      }),
      chooseFromLibraryButtonTitle: intl.formatMessage({
        id: 'imagepicker.chooseFromLibraryButtonTitle',
      }),
      customButtons: withDocuments
        ? [
            {
              name: 'Documents',
              title: intl.formatMessage({
                id: 'imagepicker.addDocumentTitle',
              }),
            },
          ]
        : [],
      permissionDenied: {
        title: permissionDenied.title,
        text: permissionDenied.text,
        reTryTitle: permissionDenied.settings,
        okTitle: permissionDenied.notNow,
      },
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    },
    async response => {
      if (response.error) {
        // Refer to https://github.com/react-native-community/react-native-image-picker/blob/master/ios/ImagePickerManager.m#L209
        if (
          response.error === 'Photo library permissions not granted' &&
          Platform.OS === 'ios'
        ) {
          Alert.alert(
            permissionDenied.title,
            permissionDenied.text,
            [
              {
                text: permissionDenied.notNow,
              },
              {
                text: permissionDenied.settings,
                onPress: () => Linking.openURL('app-settings://employeeportal'),
                style: 'default',
              },
            ],
            { cancelable: true },
          );
        } else {
          const defaultMessage = intl.formatMessage({
            id: 'globalDefaultErrorMessage',
          });
          Alert.alert(
            intl.formatMessage({ id: 'somethingWentWrong' }),
            intl.formatMessage({
              id: `imagepicker.${response.error}`,
              defaultMessage,
            }),
          );
        }
        onError && onError(response.error);
        return;
      } else if (response.didCancel) {
        onCancel && onCancel();
        return;
      } else {
        let file;
        if (response.customButton) {
          await getDocumentFromDocumentPicker(
            intl,
            onSuccess,
            onError,
            onCancel,
          );
        } else {
          file = response;
          try {
            const image = await compressImage(file);
            onSuccess && onSuccess(image);
          } catch (e) {
            if (e.message === FILE_SIZE_TOO_LARGE) {
              Alert.alert(
                intl.formatMessage({ id: 'imagepicker.photoTooLarge' }),
                intl.formatMessage({
                  id: `imagepicker.tryAnotherPhoto`,
                }),
              );
            }
            onError && onError(e.message);
          }
        }
      }
    },
  );
}

export default getImageFromImagePicker;
