import React from 'react';
import { renderForTest } from '@testUtils';
import { FlatList } from 'react-native';
import { ListItem } from '@wrappers/components';
import ProfileLanguageSettingsScreen, {
  GreenTick,
} from '../ProfileLanguageSettingsScreen';
import { act } from 'react-test-renderer';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import mockNavigation from '@testUtils/__mocks__/navigation';
import { SUPPORTED_LANGUAGES } from '@config/locale';

const navigation = {
  ...mockNavigation,
  dispatch: jest.fn(),
};

const api = {
  updateMemberProfile: jest.fn(() => Promise.resolve({ status: 200 })),
};
describe('ProfileLanguageSettingsScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  let supportedLanguages = SUPPORTED_LANGUAGES;
  let getLanguageList = component => component.queryAllByType(FlatList);
  let getLanguages = component => component.queryAllByType(ListItem);
  const initialState = {
    api,
    initialState: {
      user: {
        clientId: 'testClient',
        userId: 'userId',
        membersMap: {
          userId: {
            clientId: 'testClient',
          },
        },
        preferredLocale: 'zh-HK',
      },
    },
  };

  it('should render a list of supported languages', () => {
    const component = renderForTest(
      <ProfileLanguageSettingsScreen />,
      initialState,
    );

    expect(getLanguageList(component)).toHaveLength(1);
  });

  it('should pass supported languages to the list', () => {
    const component = renderForTest(
      <ProfileLanguageSettingsScreen />,
      initialState,
    );
    let list = getLanguageList(component)[0];

    expect(list.props.data).toHaveLength(supportedLanguages.length);
    expect(list.props.data).toEqual(expect.arrayContaining(supportedLanguages));
  });

  it('should render each supported language as a list item', () => {
    const component = renderForTest(
      <ProfileLanguageSettingsScreen />,
      initialState,
    );
    const languages = getLanguages(component);

    expect(languages).toHaveLength(supportedLanguages.length);
    expect(
      languages.map(language => language.props.children.props.children),
    ).toEqual(
      expect.arrayContaining(
        supportedLanguages.map(supported => supported.label),
      ),
    );
  });

  it('should show green tick icon only for the language associated with intl locale', () => {
    const selectedLanguage = supportedLanguages[1];
    const component = renderForTest(
      <ProfileLanguageSettingsScreen />,
      initialState,
    );
    const languages = getLanguages(component);

    const languageWithRightIcon = languages.filter(language => {
      return !!language.props.rightIcon;
    });
    expect(languageWithRightIcon).toHaveLength(1);
    expect(languageWithRightIcon[0].props.children.props.children).toEqual(
      selectedLanguage.label,
    );
    expect(languageWithRightIcon[0].props.rightIcon.type).toBe(GreenTick);
  });

  it('should go back to profile screen when user change language settings', async () => {
    const component = renderForTest(
      <ProfileLanguageSettingsScreen navigation={navigation} />,
      initialState,
    );
    const languages = getLanguages(component);
    const listItem = languages[0];

    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    const languageWithRightIcon = languages.filter(language => {
      return !!language.props.rightIcon;
    });

    expect(languageWithRightIcon[0].props.children.props.children).toEqual(
      listItem.props.children.props.children,
    );
    expect(languageWithRightIcon[0].props.rightIcon.type).toBe(GreenTick);
    expect(api.updateMemberProfile).toHaveBeenCalled();
    expect(navigation.dispatch).toHaveBeenCalledTimes(1);
  });
});
