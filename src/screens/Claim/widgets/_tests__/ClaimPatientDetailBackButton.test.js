import React from 'react';
import { ClaimPatientDetailBackButton } from '@screens/Claim';
import { renderForTest } from '@testUtils';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import { Alert } from 'react-native';
import messages from '@messages/en-HK.json';
import navigation from '@testUtils/__mocks__/navigation';

jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));

describe('ClaimPatientDetailBackButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const component = renderForTest(<ClaimPatientDetailBackButton />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should display alert when icon back button is pressed', async () => {
    const { getByProps } = renderForTest(<ClaimPatientDetailBackButton />);
    const icon = getByProps({
      testID: 'iconIcon',
    });
    await fireEvent.press(icon);
    await flushMicrotasksQueue();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert.mock.calls[0][0]).toBe(messages.leaveThisPage);
    expect(Alert.alert.mock.calls[0][1]).toBe(
      messages['claim.submitResetWarning'],
    );
    expect(Alert.alert.mock.calls[0][2][0].text).toBe(messages.stay);
    expect(Alert.alert.mock.calls[0][2][1].text).toBe(messages.leave);
  });

  it('should navigate to CLAIMS_LIST screen when alert leave button is pressed', async () => {
    const { getByProps } = renderForTest(
      <ClaimPatientDetailBackButton navigation={navigation} />,
    );
    const icon = getByProps({
      testID: 'iconIcon',
    });
    act(() => {
      fireEvent.press(icon);
    });
    act(() => {
      Alert.alert.mock.calls[0][2][1].onPress();
    });
    await flushMicrotasksQueue();

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should stay on current screen when alert stay button is pressed', async () => {
    const { getByProps } = renderForTest(
      <ClaimPatientDetailBackButton navigation={navigation} />,
    );
    const icon = getByProps({
      testID: 'iconIcon',
    });
    act(() => {
      fireEvent.press(icon);
    });
    await flushMicrotasksQueue();
    act(() => {
      Alert.alert.mock.calls[0][2][0].onPress();
    });

    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('should should reset consultation type details when pressed', async () => {
    const { getByProps } = renderForTest(
      <ClaimPatientDetailBackButton navigation={navigation} />,
    );
    const icon = getByProps({
      testID: 'iconIcon',
    });
    act(() => {
      fireEvent.press(icon);
    });
    await flushMicrotasksQueue();
  });
});
