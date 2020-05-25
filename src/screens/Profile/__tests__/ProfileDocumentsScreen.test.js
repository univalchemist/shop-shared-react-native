import React from 'react';
import { render } from '@testUtils';
import ProfileDocumentsScreen from '../ProfileDocumentsScreen';
import {
  ErrorPanel,
  ListSkeletonPlaceholder,
  ListPicker,
} from '@wrappers/components';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';

jest.useFakeTimers();

describe('ProfileDocumentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a loader when data is being fetched', () => {
    const [Screen] = render(<ProfileDocumentsScreen />, {
      api: {
        getDocuments: () => Promise.resolve(),
      },
    });
    const loaderComponent = Screen.getByType(ListSkeletonPlaceholder);
    expect(loaderComponent).toBeDefined();
  });

  it('should render error panel when error during fetching', async () => {
    const [Screen] = render(<ProfileDocumentsScreen />, {
      api: {
        getDocuments: () => Promise.reject(),
      },
    });

    await flushMicrotasksQueue();
    act(() => {});

    expect(Screen.getByType(ErrorPanel)).toBeDefined();
  });

  it('should render the no documents text when there is no available data', async () => {
    const [Screen] = render(<ProfileDocumentsScreen />, {
      api: {
        getDocuments: () =>
          Promise.resolve({
            data: [],
          }),
      },
    });

    await flushMicrotasksQueue();

    expect(Screen.getByText('No documents')).toBeDefined();
  });

  it('should render the list of documents when there is available data and navigate on press', async () => {
    const availableDataDocumentsState = [
      {
        id: 3,
        code: 'HS',
        categoryId: 'claimForm',
        title: 'HSBC HealthPlus - Hospitalisation & Surgical Claim Form',
        displayOrder: 2,
        url:
          'https://microservices.localhost/claim/api/v1/clients/testClient/documents/3',
      },
      {
        id: 5,
        code: 'MA',
        categoryId: 'claimForm',
        title: 'HSBC HealthPlus - Maternity Subsidy Claim Form',
        displayOrder: 3,
        url:
          'https://microservices.localhost/claim/api/v1/clients/testClient/documents/5',
      },
      {
        id: 1,
        code: 'OP',
        categoryId: 'claimForm',
        title:
          'HSBC HealthPlus – Outpatient Benefit / Wellness Claims Claim Form',
        displayOrder: 1,
        url:
          'https://microservices.localhost/claim/api/v1/clients/testClient/documents/1',
      },
    ];

    const navigation = { navigate: jest.fn() };

    const [Screen] = render(
      <ProfileDocumentsScreen navigation={navigation} />,
      {
        api: {
          getDocuments: () =>
            Promise.resolve({
              data: availableDataDocumentsState,
            }),
        },
        initialState: {
          user: {
            clientId: 'testClient',
          },
        },
      },
    );

    await flushMicrotasksQueue();

    const listPickerComponent = Screen.getByType(ListPicker);
    const documentText = Screen.getByText(
      'HSBC HealthPlus - Hospitalisation & Surgical Claim Form',
    );
    expect(listPickerComponent).toBeDefined();
    expect(documentText).toBeDefined();

    await fireEvent.press(documentText);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(
      'ProfileDocumentViewerModal',
      {
        allowShare: true,
        contentType: 'application/pdf',
        secure: true,
        uri:
          'https://microservices.localhost/claim/api/v1/clients/testClient/documents/3',
      },
    );
  });
});
