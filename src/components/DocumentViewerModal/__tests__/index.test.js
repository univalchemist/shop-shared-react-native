import { renderForTest } from '@testUtils';
import React from 'react';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import { Box } from '@wrappers/components';
import Pdf from 'react-native-pdf';
import ImageZoom from 'react-native-image-pan-zoom';
import api from '@services/api';

import DocumentViewerModal from '../index';

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.mock('react-native/Libraries/ActionSheetIOS/ActionSheetIOS', () => ({
  showActionSheetWithOptions: jest.fn(),
}));
jest.mock('@utils', () => ({
  ...require.requireActual('@utils'),
  getImageSizeFromUri: () => ({
    width: 999,
    height: 999,
  }),
  getImageSizeRelativeToView: () => ({
    width: 999,
    height: 999,
  }),
  showConfirmation: jest.fn(),
}));
jest.mock('@services/api', () => ({
  getAuthHeaders: jest.fn(),
}));

describe('DocumentViewerModal', () => {
  const navigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  // TODO: update test cases

  it.skip('should render PDF document properly', async () => {
    const route = {
      params: {
        uri: 'file://somefile.pdf',
        contentType: 'application/pdf',
      },
    };

    api.getAuthHeaders.mockResolvedValueOnce({ Authorization: 'Bearer token' });

    const component = renderForTest(
      <DocumentViewerModal navigation={navigation} route={route} />,
    );
    await flushMicrotasksQueue();

    const pdf = component.getByType(Pdf);

    expect(pdf).toBeDefined();
    expect(api.getAuthHeaders).toHaveBeenCalled();
  });

  it.skip('should log error when loading pdf error', () => {
    const route = {
      params: {
        uri: 'file://somefile.pdf',
        contentType: 'application/pdf',
      },
    };
    api.getAuthHeaders.mockResolvedValueOnce({ Authorization: 'Bearer token' });
    console.log = jest.fn();

    const component = renderForTest(
      <DocumentViewerModal navigation={navigation} route={route} />,
    );

    const pdf = component.getByType(Pdf);

    fireEvent(pdf, 'onError');
    expect(console.log).toHaveBeenCalled();
  });

  it.skip('should render image document properly', async () => {
    const route = {
      params: {
        uri: 'file://somefile.jpg',
        contentType: 'image/jpg',
      },
    };
    const event = {
      nativeEvent: {
        layout: {
          width: 32,
          height: 32,
        },
      },
    };

    api.getAuthHeaders.mockResolvedValueOnce({ Authorization: 'Bearer token' });

    const component = renderForTest(
      <DocumentViewerModal navigation={navigation} route={route} />,
    );
    const box = component.getByType(Box);

    act(() => {
      fireEvent(box, 'onLayout', event);
    });

    await flushMicrotasksQueue();

    const image = component.getByType(ImageZoom);

    expect(image).toBeDefined();
  });
});
