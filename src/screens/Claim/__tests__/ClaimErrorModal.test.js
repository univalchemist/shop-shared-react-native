import React from 'react';
import { render } from '@testUtils';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import MockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler';
import { BackHandler } from 'react-native';
import { CLAIMS_LIST } from '@routes';
import messages from '@messages/en-HK.json';
import mockNavigation from '@testUtils/__mocks__/navigation';
import ClaimErrorModal from '../ClaimErrorModal';
import { StackActions } from '@react-navigation/native';

const navigation = {
  ...mockNavigation,
  dangerouslyGetState: jest.fn().mockImplementation(() => ({
    routes: [
      {
        routeName: CLAIMS_LIST,
      },
    ],
  })),
};
jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => MockBackHandler,
);

describe('ClaimErrorModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navigation.clearAll();
  });

  it('should render correctly', () => {
    const [Component] = render(<ClaimErrorModal />);
    // expect(Component.toJSON()).toMatchSnapshot();
  });

  it('should navigate to CLAIM_REVIEW', async () => {
    const [Component] = render(<ClaimErrorModal navigation={navigation} />);
    const button = Component.getByProps({
      title: messages['claim.backToReviewClaim'],
    });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.pop(2));
  });

  it('should navigate CLAIM_PATIENT_DETAILS', async () => {
    navigation.reset.mockResolvedValueOnce();

    const [Component] = render(<ClaimErrorModal navigation={navigation} />);
    const button = Component.getByProps({
      title: messages['claim.makeAnotherClaimText'],
    });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.reset).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalled();
  });

  it('should navigate to CLAIM_REVIEW on BackButtonPress', async () => {
    const [Component] = render(<ClaimErrorModal navigation={navigation} />);

    await flushMicrotasksQueue();
    BackHandler.mockPressBack();

    Component.unmount();
    expect(navigation.dispatch).toHaveBeenCalledWith(StackActions.pop(2));
  });
});
