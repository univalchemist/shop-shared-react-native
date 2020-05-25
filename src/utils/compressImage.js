import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const FILE_SIZE_LIMIT = 2097152;
export const MAX_ITERATION = 5;
export const MAX_WIDTH_OR_HEIGHT = 1024;
export const FILE_SIZE_TOO_LARGE = 'File size too large';

async function compressImage(file, options = {}) {
  let remainingTrials = options.maxIteration || MAX_ITERATION;
  const maxSizeByte = options.maxSizeByte || FILE_SIZE_LIMIT;
  const maxWidthOrHeight = options.maxWidthOrHeight || MAX_WIDTH_OR_HEIGHT;
  let quality = 1;
  let size = file.fileSize;

  const { fileName = 'image.jpg', width, height } = file;
  const resize =
    width > height ? { width: maxWidthOrHeight } : { height: maxWidthOrHeight };

  if (size <= maxSizeByte) {
    return file;
  }

  let compressedFile = file;
  while (remainingTrials > 0 && size > maxSizeByte) {
    quality *= 0.9;
    const compressedImage = await ImageManipulator.manipulateAsync(
      file.uri,
      [
        {
          resize,
        },
      ],
      {
        format: 'jpeg',
        compress: quality,
      },
    );

    compressedFile = await FileSystem.getInfoAsync(compressedImage.uri, {
      size: true,
    });
    size = compressedFile.size;
    if (size <= maxSizeByte) {
      compressedFile.fileName = fileName;
      compressedFile.type = 'image/jpeg';
      return compressedFile;
    }
    remainingTrials--;
  }
  throw Error(FILE_SIZE_TOO_LARGE);
}

export default compressImage;
