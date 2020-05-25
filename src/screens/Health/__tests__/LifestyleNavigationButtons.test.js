import React from 'react';
import { TouchableHighlight } from 'react-native';
import { renderForTest } from '@testUtils';
import { fireEvent } from 'react-native-testing-library';
import { Image, Text } from '@wrappers/components';
import LifestyleNavigationButtons from '../LifestyleNavigationButtons';
import { pencilIcon, magnifyingGlassIcon } from '@images';
import * as translations from '../../../../messages';
import englishMessages from '@messages/en-HK.json';
import { LIFESTYLE_FORM, PANEL_SEARCH } from '@routes';

describe('LifestyleNavigationButtons', () => {
  const renderButtons = ({
    navigation = { navigate: jest.fn() },
    hasLifestyleResults = true,
  }) => {
    const component = renderForTest(
      <LifestyleNavigationButtons navigation={navigation} />,
      {
        initialState: {
          health: { hasLifestyleResults },
        },
      },
    );
    return component.queryAllByType(TouchableHighlight);
  };
  const buttonContent = button => button.props.children;
  const buttonIcon = button =>
    buttonContent(button).props.children[0].props.children;
  const buttonText = button =>
    buttonContent(button).props.children[1].props.children;

  it('should render 2 buttons', () => {
    const buttons = renderButtons({});

    expect(buttons).toHaveLength(2);
  });

  delete translations.default;

  describe.each(Object.keys(translations))('%s text resources', locale => {
    const resourceKeys = [
      'panelSearch.searchForClinics',
      'health.addLifestyleData',
      'health.updateLifestyleData',
    ];

    test.each(resourceKeys)(
      'should have translation for key %s',
      resourceKey => {
        expect(translations[locale][resourceKey]).toBeDefined();
      },
    );
  });

  describe.each`
    hasLifestyleResults | textId
    ${true}             | ${'health.updateLifestyleData'}
    ${false}            | ${'health.addLifestyleData'}
  `(
    'When hasLifestyleResults is $hasLifestyleResults, render $textId button',
    ({ hasLifestyleResults, textId }) => {
      let updateLifestyleDataButton, mockNavigation;
      beforeEach(() => {
        mockNavigation = { navigate: jest.fn() };
        updateLifestyleDataButton = renderButtons({
          navigation: mockNavigation,
          hasLifestyleResults,
        })[0];
      });

      it('should render a pencil icon', () => {
        const icon = buttonIcon(updateLifestyleDataButton);
        expect(icon.type).toEqual(Image);
        expect(icon.props.source).toEqual(pencilIcon);
      });

      it(`should render text with ${textId}`, () => {
        const text = buttonText(updateLifestyleDataButton);
        expect(text.type).toEqual(Text);
        expect(text.props.children).toEqual(englishMessages[textId]);
      });

      it('should navigate to lifestyle form when clicked', () => {
        fireEvent.press(updateLifestyleDataButton);
        expect(mockNavigation.navigate).toHaveBeenCalledWith(LIFESTYLE_FORM);
      });
    },
  );

  describe('Button to search panel clinic', () => {
    let searchPanelClinicButton, mockNavigation;
    beforeEach(() => {
      mockNavigation = { navigate: jest.fn() };
      searchPanelClinicButton = renderButtons({
        navigation: mockNavigation,
      })[1];
    });

    it('should render a magnifying glass icon', () => {
      const icon = buttonIcon(searchPanelClinicButton);
      expect(icon.type).toEqual(Image);
      expect(icon.props.source).toEqual(magnifyingGlassIcon);
    });

    it('should render text for update lifestyle data', () => {
      const text = buttonText(searchPanelClinicButton);
      expect(text.type).toEqual(Text);
      expect(text.props.children).toEqual(
        englishMessages['panelSearch.searchForClinics'],
      );
    });

    it('should navigate to panel search when clicked', () => {
      fireEvent.press(searchPanelClinicButton);
      expect(mockNavigation.navigate).toHaveBeenCalledWith(PANEL_SEARCH);
    });
  });
});
