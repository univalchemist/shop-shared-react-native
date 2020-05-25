import { Image } from 'react-native';
import { getImageSizeRelativeToView, getImageSizeFromUri } from '../images';

jest.mock('react-native', () => ({
  Image: { getSize: jest.fn(), getSizeWithHeaders: jest.fn() },
}));
jest.mock('@services/api', () => ({
  getAuthHeaders: jest.fn(),
}));
describe('getImageSizeFromUri', () => {
  it('should return width and height onSuccess', async () => {
    Image.getSize.mockImplementationOnce((uri, onSuccess) => {
      onSuccess(999, 999);
    });
    const size = await getImageSizeFromUri('some-uri');
    expect(size).toEqual({ width: 999, height: 999 });
  });

  it('should return width and height onSuccess with secure image', async () => {
    Image.getSizeWithHeaders.mockImplementationOnce((uri, _, onSuccess, __) => {
      onSuccess(999, 999);
    });
    const size = await getImageSizeFromUri('some-uri', true);
    expect(size).toEqual({ width: 999, height: 999 });
  });

  it('should throw an error if unable to read uri', async () => {
    Image.getSize.mockImplementationOnce((uri, onSuccess, onFailure) => {
      onFailure('Some error');
    });

    await expect(getImageSizeFromUri('some-uri')).rejects.toEqual('Some error');
  });
});

describe('getImageSizeRelativeToView', () => {
  it('should adjust image width if image size width is larger than image size height', () => {
    const imageSize = {
      width: 50,
      height: 45,
    };
    const viewSize = {
      width: 100,
      height: 150,
    };

    const relativeImageSize = getImageSizeRelativeToView(imageSize, viewSize);

    expect(relativeImageSize.width).toBe(viewSize.width);
    expect(relativeImageSize.height).toBe(90);
  });
  it('should adjust image width if image size width is larger than image size height, and adjusted height is larger than the view height', () => {
    const imageSize = {
      width: 50,
      height: 45,
    };

    const viewSize = {
      width: 100,
      height: 80,
    };

    const relativeImageSize = getImageSizeRelativeToView(imageSize, viewSize);

    expect(relativeImageSize.width.toFixed(2)).toBe('88.89');
    expect(relativeImageSize.height).toBe(viewSize.height);
  });
  it('should adjust image width if image size width is lesse than image size height', () => {
    const imageSize = {
      width: 50,
      height: 60,
    };
    const viewSize = {
      width: 100,
      height: 150,
    };

    const relativeImageSize = getImageSizeRelativeToView(imageSize, viewSize);

    expect(relativeImageSize.width).toBe(viewSize.width);
    expect(relativeImageSize.height).toBe(120);
  });
  it('should adjust image width if image size width is lesse than image size height, and relative image width is less than viewsize width ', () => {
    const imageSize = {
      width: 50,
      height: 60,
    };
    const viewSize = {
      width: 200,
      height: 150,
    };

    const relativeImageSize = getImageSizeRelativeToView(imageSize, viewSize);

    expect(relativeImageSize.width).toBe(125);
    expect(relativeImageSize.height).toBe(viewSize.height);
  });
});
