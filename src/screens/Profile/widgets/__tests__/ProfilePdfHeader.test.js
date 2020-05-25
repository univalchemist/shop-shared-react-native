import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ProfilePdfHeader from '../ProfilePdfHeader';
import { renderForTest } from '@testUtils';
import {
  shareDocumentAndroid as mockShareAndroidDocument,
  shareDocumentIOS as mockShareIosDocument,
} from '@utils';

const mockPlatform = OS => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS,
    select: objs => objs[OS],
  }));
};

jest.mock('@utils', () => {
  return {
    ...require.requireActual('@utils'),
    shareDocumentAndroid: jest.fn(),
    shareDocumentIOS: jest.fn(),
  };
});

describe('ProfilePdfHeader', () => {
  const uri = 'http://www.test.com/123.jpg';

  it('should trigger the android function when the icon is pressed', async () => {
    mockPlatform('android');
    const { getByProps } = renderForTest(<ProfilePdfHeader uri={uri} />);
    const icon = getByProps({
      testID: 'iconIcon',
    });
    await fireEvent.press(icon);
    await flushMicrotasksQueue();

    expect(mockShareAndroidDocument).toHaveBeenCalledTimes(1);
  });

  it('should trigger the ios function when the icon is pressed', async () => {
    mockPlatform('ios');
    const { getByProps } = renderForTest(<ProfilePdfHeader uri={uri} />);
    const icon = getByProps({
      testID: 'iconIcon',
    });
    await fireEvent.press(icon);
    await flushMicrotasksQueue();

    expect(mockShareIosDocument).toHaveBeenCalledTimes(1);
  });
});
