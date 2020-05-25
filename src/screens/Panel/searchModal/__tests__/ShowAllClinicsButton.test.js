import React from 'react';
import { renderForTest } from '@testUtils';
import { Image, ListItem, Text } from '@wrappers/components';
import { ShowAllClinicsButton } from '../ShowAllClinicsButton';
import messages from '@messages/en-HK.json';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { panelDoctorIcon } from '@images';
import { FilterTypes } from '../../utils/filter';

describe('Show all clinics button', () => {
  const updateSearchTerm = jest.fn();
  const updateButtonPressCount = jest.fn();
  const updateSuccessfulSearchTerm = jest.fn();
  const updateFilter = jest.fn();
  let showAllClinicsButton;

  beforeEach(() => {
    showAllClinicsButton = renderForTest(
      <ShowAllClinicsButton
        buttonCount={0}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
      />,
    );
  });

  it('should render a list item', () => {
    const listItem = showAllClinicsButton.queryAllByType(ListItem);

    expect(listItem.length).toBe(1);
  });

  it('should render show all clinics text', () => {
    const text = showAllClinicsButton.queryAllByType(Text)[0];

    expect(text.props.children).toBe(messages['panelSearch.showAllClinics']);
  });

  it('should render show all clinics icon', () => {
    const listItem = showAllClinicsButton.queryAllByType(ListItem)[0];

    expect(listItem.props.leftIcon.type).toBe(Image);
    expect(listItem.props.leftIcon.props.source).toBe(panelDoctorIcon);
  });

  describe('on press', () => {
    beforeAll(async () => {
      const listItem = showAllClinicsButton.queryAllByType(ListItem)[0];
      act(() => {
        fireEvent.press(listItem);
      });
      await flushMicrotasksQueue();
    });

    it('should update search term with empty string', () => {
      expect(updateSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSearchTerm).toHaveBeenCalledWith('');
    });

    it('should update successful search term with empty string', () => {
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledTimes(1);
      expect(updateSuccessfulSearchTerm).toHaveBeenCalledWith('');
    });

    it('should increment button press count to force rerender upon multiple press', () => {
      expect(updateButtonPressCount).toHaveBeenCalledTimes(1);
    });

    it('should add all clinics filter', async () => {
      expect(updateFilter).toHaveBeenCalledTimes(1);
      expect(updateFilter).toHaveBeenCalledWith({
        type: FilterTypes.ALL_CLINICS,
        values: ['all clinics'],
      });
    });
  });
});
