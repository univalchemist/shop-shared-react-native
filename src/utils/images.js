import { Image } from 'react-native';
import api from '@services/api';

function getImageSizeFromUri(uri, secure) {
  return new Promise(async (resolve, reject) => {
    if (!secure) {
      Image.getSize(
        uri,
        (width, height) => {
          resolve({ width, height });
        },
        reject,
      );
    } else {
      const authHeaders = await api.getAuthHeaders();
      Image.getSizeWithHeaders(
        uri,
        authHeaders,
        (width, height) => {
          resolve({ width, height });
        },
        reject,
      );
    }
  });
}

function getImageSizeRelativeToView(imageSize, viewSize) {
  const relativeImageSize = {};
  const imageAspectRatio = imageSize.width / imageSize.height;
  const viewAspectRatio = viewSize.width / viewSize.height;

  if (imageAspectRatio > viewAspectRatio) {
    relativeImageSize.width = viewSize.width;
    relativeImageSize.height = relativeImageSize.width / imageAspectRatio;
  } else {
    relativeImageSize.height = viewSize.height;
    relativeImageSize.width = imageAspectRatio * relativeImageSize.height;
  }
  return relativeImageSize;
}

export { getImageSizeFromUri, getImageSizeRelativeToView };
