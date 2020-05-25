import React from 'react';
import ProfileCommunicationSettingsScreen from '../ProfileCommunicationSettingsScreen';
import { renderForTest } from '@testUtils';
import { Switch } from 'react-native';
import messages from '@messages/en-HK.json';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import mockNavigation from '@testUtils/__mocks__/navigation';

describe('ProfileSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('render communication settings screen with isEdmOptedOut true', () => {
    const screen = renderForTest(<ProfileCommunicationSettingsScreen />, {
      initialState: {
        user: {
          isEdmOptedOut: true,
        },
      },
    });

    const wellnessText = screen.getByText(
      messages['profile.settings.communication.wellnessNewsletterLabel'],
    );
    const switchComponent = screen.getByType(Switch);

    expect(wellnessText).toBeDefined();
    expect(switchComponent.props.value).toEqual(true);
  });

  it('render communication settings screen with isEdmOptedOut false', () => {
    const screen = renderForTest(<ProfileCommunicationSettingsScreen />, {
      initialState: {
        user: {
          isEdmOptedOut: false,
        },
      },
    });

    const switchComponent = screen.getByType(Switch);
    expect(switchComponent.props.value).toEqual(false);
  });

  test('should navigate my wellness newsletter screen', async () => {
    const navigation = mockNavigation;

    const screen = renderForTest(
      <ProfileCommunicationSettingsScreen navigation={navigation} />,
    );
    await flushMicrotasksQueue();
    const text = screen.getByText(messages.edmPromotional);

    act(() => {
      fireEvent.press(text);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});
