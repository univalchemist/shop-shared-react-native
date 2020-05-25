import { renderForTest, render } from '@testUtils';
import React from 'react';
import { Button, ErrorPanel } from '@wrappers/components';
import { CLAIM_DETAILS_FORM, CLAIM_PATIENT_MODAL } from '@routes';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import messages from '@messages/en-HK.json';
import ClaimPatientDetailsScreen, {
  ClaimPatientDetailsSkeletonPlaceholder,
} from '../ClaimPatientDetailsScreen';
import MockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler';
import { BackHandler, Alert } from 'react-native';
import mockNavigation from '@testUtils/__mocks__/navigation';

jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => MockBackHandler,
);

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

const initialState = {
  form: { claimDetailsForm: { values: { patientName: 'foo' } } },
  user: {
    clientId: 'clientId',
    userId: '3',
    membersMap: {
      '3': {
        contactNumber: '12345678',
        fullName: 'hello',
        memberId: '3',
      },
    },
  },
};

jest.useFakeTimers();

const navigation = mockNavigation;

describe('ClaimPatientDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all inputs an text on patient detail screen if patient data is present', async () => {
    const [Component] = render(
      <ClaimPatientDetailsScreen navigation={navigation} />,
      {
        api: {
          getClaimTypes: jest.fn(() =>
            Promise.resolve({
              data: [],
            }),
          ),
        },
        initialState,
      },
    );

    expect(
      Component.getByType(ClaimPatientDetailsSkeletonPlaceholder),
    ).toBeDefined();

    await flushMicrotasksQueue();

    const patientNameField = Component.getByProps({
      label: messages.patientNameLabel,
    });
    const contactNumberField = Component.getByProps({
      label: messages.contactNumberLabel,
    });

    const text = Component.getByText(messages['claim.conditionText']);

    expect(patientNameField).toBeDefined();
    expect(contactNumberField).toBeDefined();
    expect(text).toBeDefined();
  });

  it('should navigate to claim detail screen when click on "Add Claim Details" button', async () => {
    const [Component] = render(
      <ClaimPatientDetailsScreen navigation={navigation} />,
      {
        api: {
          getClaimTypes: jest.fn(() =>
            Promise.resolve({
              data: [],
            }),
          ),
        },
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const button = Component.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_DETAILS_FORM);
  });

  it('should navigate to CLAIM_PATIENT_MODAL when patientName field is pressed', async () => {
    const [Component] = render(
      <ClaimPatientDetailsScreen navigation={navigation} />,
      {
        api: {
          getClaimTypes: jest.fn(() =>
            Promise.resolve({
              data: [],
            }),
          ),
        },
        initialState,
      },
    );
    await flushMicrotasksQueue();
    const button = Component.getByProps({ name: 'patientName' });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(CLAIM_PATIENT_MODAL);
  });

  it('should trigger an Alert on BackButtonPress', async () => {
    renderForTest(<ClaimPatientDetailsScreen navigation={navigation} />, {
      initialState,
      api: {
        getClaimTypes: jest.fn(() =>
          Promise.resolve({
            data: [],
          }),
        ),
      },
    });
    act(() => {
      navigation.mockEmitState('didFocus');
    });
    await flushMicrotasksQueue();
    BackHandler.mockPressBack();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it('should display error panel on fetching error', async () => {
    const [Component] = render(
      <ClaimPatientDetailsScreen navigation={navigation} />,
      {
        initialState: {
          ...initialState,
          form: {
            claimDetailsForm: {
              values: { claimTypeId: 1 },
            },
          },
        },
        api: {
          getClaimTypes: jest.fn().mockRejectedValueOnce(),
        },
      },
    );

    await flushMicrotasksQueue();
    expect(Component.getByType(ErrorPanel)).toBeDefined();
  });
});
