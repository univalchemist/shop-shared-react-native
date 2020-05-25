import React from 'react';
import { renderForTest } from '@testUtils';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import MockBackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler';
import { BackHandler } from 'react-native';
import messages from '@messages/en-HK.json';
import navigation from '@testUtils/__mocks__/navigation';
import ClaimSuccessModal from '../ClaimSuccessModal';
import { getClaims, updateClaimFilters } from '@store/claim/actions';
import { CLAIMS_LIST } from '@routes';

jest.mock('@store/claim/actions', () => ({
  getClaims: jest.fn(() => {
    return {
      type: 'TEST_CALL',
      payload: {},
    };
  }),
  updateClaimFilters: jest.fn(() => {
    return {
      type: 'TEST_CALL',
      payload: {},
    };
  }),
}));

jest.mock(
  'react-native/Libraries/Utilities/BackHandler',
  () => MockBackHandler,
);

describe('ClaimSuccessModal', () => {
  const renderClaimSuccessModal = () =>
    renderForTest(
      <ClaimSuccessModal
        navigation={navigation}
        updateClaimFilters={updateClaimFilters}
        getClaims={getClaims}
      />,
    );
  beforeEach(() => {
    jest.clearAllMocks();
    navigation.clearAll();
  });

  it.skip('should render correctly', () => {
    const component = renderClaimSuccessModal();
    expect(component.toJSON()).toMatchSnapshot();
  });

  describe('upon pressing view submitted claims', () => {
    it('should clear existing claim filters if any', async () => {
      const component = renderClaimSuccessModal();
      const button = component.getByProps({
        title: messages['claim.viewSubmittedClaimsText'],
      });

      act(() => {
        fireEvent.press(button);
      });
      await flushMicrotasksQueue();

      expect(updateClaimFilters).toHaveBeenCalledWith([]);
    });

    it('should get claims', async () => {
      const component = renderClaimSuccessModal();
      const button = component.getByProps({
        title: messages['claim.viewSubmittedClaimsText'],
      });

      act(() => {
        fireEvent.press(button);
      });
      await flushMicrotasksQueue();

      expect(getClaims).toHaveBeenCalledTimes(1);
    });

    it('should navigate to CLAIMS_LIST', async () => {
      const component = renderClaimSuccessModal();
      const button = component.getByProps({
        title: messages['claim.viewSubmittedClaimsText'],
      });
      act(() => {
        fireEvent.press(button);
      });
      await flushMicrotasksQueue();

      expect(navigation.dispatch).toHaveBeenCalled();
    });
  });

  it('should navigate to CLAIMS and then CLAIM_PATIENT_DETAILS upon pressing make another claim', async () => {
    const component = renderClaimSuccessModal();
    const button = component.getByProps({
      title: messages['claim.makeAnotherClaimText'],
    });
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(navigation.reset).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should navigate to CLAIMS on BackButtonPress', async () => {
    const component = renderClaimSuccessModal();

    await flushMicrotasksQueue();
    BackHandler.mockPressBack();

    component.unmount();

    expect(navigation.dispatch).toHaveBeenCalled();
  });
});
