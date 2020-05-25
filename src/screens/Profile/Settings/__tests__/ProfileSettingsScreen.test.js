import React from 'react';
import ProfileSettingsScreen from '../ProfileSettingsScreen';
import { renderForTest } from '@testUtils';
import { FlatList } from 'react-native';
import messages from '@messages/en-HK.json';
import { PROFILE_LANGUAGE_SETTINGS, BIOMETRIC_SETTING_SCREEN } from '@routes';
import { ListItemWithRightChevron } from '@wrappers/components';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { logout, resetPassword } from '@store/user/actions';
import DeviceInfo from 'react-native-device-info';

jest.mock('@store/user/actions', () => ({
  logout: jest.fn(() => ({
    type: 'dummy',
    payload: {},
  })),
  resetPassword: jest.fn(() => Promise.resolve({})),
}));

describe('ProfileSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let mockNavigation = {
    navigate: jest.fn(),
  };
  let settingsList = screen => screen.queryAllByType(FlatList);
  let settings = screen => screen.queryAllByType(ListItemWithRightChevron);
  let renderComponent = ({ navigation }) => {
    if (!navigation) navigation = mockNavigation;
    return renderForTest(<ProfileSettingsScreen navigation={navigation} />);
  };

  it('render a list of settings options', () => {
    const screen = renderComponent({});

    expect(settingsList(screen)).toHaveLength(1);
  });

  it('render each settings as a ListItemWithRightChevron', () => {
    const screen = renderComponent({});

    expect(settings(screen)).toHaveLength(5);
  });

  it('pass Language as an item in settings list', () => {
    const screen = renderComponent({});
    const settings = settingsList(screen)[0];

    expect(settings.props.data.length).toBeGreaterThanOrEqual(1);
    expect(settings.props.data).toContainEqual({
      label: messages['profile.settings.language'],
      route: PROFILE_LANGUAGE_SETTINGS,
    });
  });

  it('should render Language as one of the settings', () => {
    const screen = renderComponent({});
    const allSettings = settings(screen);

    expect(allSettings.length).toBeGreaterThanOrEqual(1);
    expect(allSettings[1].props.children.props.children).toBe(
      messages['profile.settings.language'],
    );
  });

  it('should navigate to language settings page upon pressing Language', async () => {
    const screen = renderComponent({});
    const languageSetting = settings(screen)[1];

    act(() => {
      fireEvent.press(languageSetting);
    });
    await flushMicrotasksQueue();

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      PROFILE_LANGUAGE_SETTINGS,
    );
  });

  it('should render reset password link', () => {
    const screen = renderComponent({});
    const settings = settingsList(screen)[0];
    expect(settings.props.data.length).toBeGreaterThanOrEqual(1);
    expect(settings.props.data).toContainEqual({
      label: messages['profile.settings.resetPassword'],
      route: null,
      handle: 'resetPassword',
    });
  });

  it('should call reset password api upon pressing Reset Password', async () => {
    const screen = renderComponent({});
    const resetPasswordSetting = settings(screen)[0];
    act(() => {
      fireEvent.press(resetPasswordSetting);
    });
    await flushMicrotasksQueue();
    expect(resetPassword).toHaveBeenCalled();
  });

  it('should render a logout button', () => {
    const screen = renderComponent({});

    const logoutButton = screen.getByText(messages.logoutButtonText);
    expect(logoutButton).toBeDefined();
  });

  it('should call the user logout action when log out is pressed', async () => {
    const screen = renderComponent({});
    const logoutButton = screen.getByText(messages.logoutButtonText);

    act(() => {
      fireEvent.press(logoutButton);
    });

    await flushMicrotasksQueue();
    expect(logout).toHaveBeenCalled();
  });

  it('should render biometric menu when feature is on', async () => {
    const FeatureToggle = require('@config/FeatureToggle').default;
    FeatureToggle.USE_BIOMETRICS.turnOn();
    jest.mock('@utils/biometrics', () => ({
      useBiometrics: jest.fn().mockReturnValue({ biometryType: 'FaceID' }),
      getBiometricDeviceType: jest
        .fn()
        .mockReturnValue({ biometryType: 'TouchID' }),
    }));
    jest.spyOn(DeviceInfo, 'getDeviceId').mockReturnValue('iphoneX');
    const screen = renderComponent({});

    const settings = settingsList(screen)[0];
    expect(settings.props.data.length).toBeGreaterThanOrEqual(1);
    expect(settings.props.data).toContainEqual({
      label: messages['profile.settings.FaceID'],
      route: BIOMETRIC_SETTING_SCREEN,
    });

    const biometricButton = screen.getByText(
      messages['profile.settings.FaceID'],
    );

    act(() => {
      fireEvent.press(biometricButton);
    });
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });
});
