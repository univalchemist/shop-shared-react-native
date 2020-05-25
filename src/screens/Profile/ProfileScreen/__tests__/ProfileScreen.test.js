import React from 'react';
import { renderForTest } from '@testUtils';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import messages from '@messages/en-HK.json';
import {
  PROFILE_DOCUMENTS,
  PROFILE_EHEALTH_CARD,
  PROFILE_HELP,
  PROFILE_MY_BENEFITS,
  PROFILE_MY_DETAILS,
  PROFILE_SETTINGS,
} from '@routes';
import { ListItem } from '@wrappers/components';

const initialState = {
  user: {
    userId: 'userId',
    membersMap: {
      userId: {
        firstName: 'test',
      },
    },
  },
};

jest.isolateModules(() => {
  jest.mock('@screens/Profile/ProfileScreen/buttons', () =>
    jest.requireActual('./../buttons'),
  );
  const ProfileScreen = jest.requireActual('../index').default;
  describe('ProfileScreen', () => {
    test('should match snapshot', () => {
      const navigation = { navigate: jest.fn() };
      const Component = renderForTest(
        <ProfileScreen navigation={navigation} />,
        {
          initialState,
        },
      );
      expect(Component.toJSON()).toMatchSnapshot();
    });

    test('should have 6 buttons', () => {
      const navigation = { navigate: jest.fn() };
      const Component = renderForTest(
        <ProfileScreen navigation={navigation} />,
        {
          initialState,
        },
      );
      const renderedButtons = Component.queryAllByType(ListItem);
      expect(renderedButtons.length).toEqual(6);
    });

    test.each([
      [messages['profile.navigation.eHealthCard'], PROFILE_EHEALTH_CARD],
      [messages['profile.navigation.myBenefits'], PROFILE_MY_BENEFITS],
      [messages['profile.navigation.myDetails'], PROFILE_MY_DETAILS],
      [messages['profile.navigation.documents'], PROFILE_DOCUMENTS],
      [messages['profile.navigation.help'], PROFILE_HELP],
      [messages['profile.settings'], PROFILE_SETTINGS],
    ])('should navigate to %s on tapping of %s', async (label, route) => {
      const navigation = { navigate: jest.fn() };
      const { getByText } = renderForTest(
        <ProfileScreen navigation={navigation} />,
        {
          initialState,
        },
      );
      const tappable = getByText(label);
      const name = getByText('test');
      expect(name).toBeDefined();

      await fireEvent.press(tappable);
      await flushMicrotasksQueue();
      expect(navigation.navigate).toHaveBeenCalledWith(route);
    });
  });
});
