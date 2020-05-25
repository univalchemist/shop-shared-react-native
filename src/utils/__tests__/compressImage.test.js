import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import compressImage, {
  FILE_SIZE_LIMIT,
  MAX_ITERATION,
  FILE_SIZE_TOO_LARGE,
} from '../compressImage';

jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(),
}));

describe('compressImage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should return original image if it's below FILE_SIZE_LIMIT", async () => {
    const fileSize = FILE_SIZE_LIMIT - 1;
    const uri = `file_${fileSize}`;
    const img = {
      fileSize,
      uri,
      type: 'image/jpeg',
      width: 1280,
      height: 1280,
    };

    const result = await compressImage(img);
    expect(result.uri).toBe(img.uri);
  });

  it('should return compressed image', async () => {
    const fileSize = FILE_SIZE_LIMIT + 1;
    const img = {
      fileSize,
      uri: `file_${fileSize}`,
      type: 'image/jpeg',
      fileName: 'xxx',
      width: 1280,
      height: 1280,
    };

    ImageManipulator.manipulateAsync.mockResolvedValueOnce({
      uri: 'someuri',
    });

    FileSystem.getInfoAsync.mockResolvedValueOnce({
      size: FILE_SIZE_LIMIT,
      uri: 'someuri',
      type: 'image/jpeg',
    });

    const result = await compressImage(img);
    expect(result.uri).toBe('someuri');
    expect(result.fileName).toBe(img.fileName);
  });

  it('should throw when image file size is too big', async () => {
    const fileSize = FILE_SIZE_LIMIT + 1;
    const img = {
      fileSize,
      uri: `file_${fileSize}`,
      type: 'image/jpeg',
      fileName: 'xxx',
      width: 1280,
      height: 1280,
    };

    ImageManipulator.manipulateAsync.mockResolvedValue({
      uri: 'someuri',
    });

    FileSystem.getInfoAsync.mockResolvedValue({
      size: FILE_SIZE_LIMIT + 1,
      uri: 'someuri',
      type: 'image/jpeg',
    });

    try {
      await compressImage(img);
    } catch (e) {
      expect(e.message).toEqual(FILE_SIZE_TOO_LARGE);
      expect(ImageManipulator.manipulateAsync).toHaveBeenCalledTimes(
        MAX_ITERATION,
      );
    }
  });
});
