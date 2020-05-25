/* eslint-disable dot-notation */
import React from 'react';
import { renderForTest } from '@testUtils';
import { CustomMultiselectCheckBox } from '@wrappers/components/form';
import FilterModalScreen, {
  FilterModalScreen as PureFilterModalScreen,
} from '../FilterModalScreen';
import messages from '@messages/en-HK.json';
import { FilterTypes, PanelClinicFilters } from '../utils/filter';
import mockNavigation from '@testUtils/__mocks__/navigation';

describe('FilterModalScreen', () => {
  const getMultiSelectCheckBox = component =>
    component.queryAllByType(CustomMultiselectCheckBox);
  const renderFilterModalScreen = ({ panelFilters, specialty = [] }) => {
    panelFilters = panelFilters || new PanelClinicFilters({});
    return renderForTest(<FilterModalScreen />, {
      initialState: {
        panel: {
          filters: panelFilters,
          specialty,
        },
      },
    });
  };

  const renderPureFilterModalScreen = ({
    navigation = mockNavigation,
    updateFilter = jest.fn(),
    selectedValues = [],
    specialty = [],
  }) => {
    return renderForTest(
      <PureFilterModalScreen
        navigation={navigation}
        updateFilter={updateFilter}
        selectedValues={selectedValues}
        specialty={specialty}
      />,
      {},
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render CustomMultiselectCheckBox', () => {
    const filterModalScreen = renderFilterModalScreen({});
    const customMultiSelectCheckBox = getMultiSelectCheckBox(filterModalScreen);

    expect(customMultiSelectCheckBox.length).toBe(1);
  });

  it('should pass specialty from global state to CustomMultiselectCheckBox', () => {
    const specialty = [
      'General practioner & group practices',
      'Occupational therapy & physiotherapy',
    ];
    const filterModalScreen = renderFilterModalScreen({ specialty });
    const customMultiSelectCheckBox = getMultiSelectCheckBox(filterModalScreen);

    expect(customMultiSelectCheckBox[0].props.data).toEqual([
      {
        label: 'General Practioner & Group Practices',
        value: 'General practioner & group practices',
      },
      {
        label: 'Occupational Therapy & Physiotherapy',
        value: 'Occupational therapy & physiotherapy',
      },
    ]);
  });

  it('should sentence case specialty labels', () => {
    const specialty = ['GENERAL PRACTIONER & GROUP PRACTICES'];
    const filterModalScreen = renderFilterModalScreen({ specialty });
    const customMultiSelectCheckBox = getMultiSelectCheckBox(filterModalScreen);

    expect(customMultiSelectCheckBox[0].props.data).toEqual([
      {
        label: 'General Practioner & Group Practices',
        value: 'GENERAL PRACTIONER & GROUP PRACTICES',
      },
    ]);
  });

  it('should render Show Results label on button', () => {
    const filterModalScreen = renderFilterModalScreen({});
    const customMultiSelectCheckBox = getMultiSelectCheckBox(
      filterModalScreen,
    )[0];

    expect(customMultiSelectCheckBox.props.buttonLabel).toBe(
      messages['showResults'],
    );
  });

  describe('on submit filters', () => {
    let mockUpdateFilter, myMockNavigation, selectedValues;
    beforeEach(() => {
      jest.clearAllMocks();
      mockUpdateFilter = jest.fn();
      myMockNavigation = mockNavigation;
      const filterModalScreen = renderPureFilterModalScreen({
        updateFilter: mockUpdateFilter,
        navigation: myMockNavigation,
      });
      const customMultiSelectCheckBox = getMultiSelectCheckBox(
        filterModalScreen,
      )[0];

      selectedValues = [
        'General practioner & group practices',
        'General surgery',
      ];
      customMultiSelectCheckBox.props.onSubmit(selectedValues);
    });

    it('should update filters in global state', () => {
      expect(mockUpdateFilter).toHaveBeenCalledWith({
        type: FilterTypes.SPECIALTY,
        values: selectedValues,
      });
    });

    it('should go back to previous screen', () => {
      expect(myMockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  it('should get initial value for selected specialty from global state', () => {
    const filters = new PanelClinicFilters({});

    filters.update({
      type: FilterTypes.SPECIALTY,
      values: ['General surgery'],
    });

    const filterModalScreen = renderFilterModalScreen({
      panelFilters: filters,
    });

    const customMultiSelectCheckBox = getMultiSelectCheckBox(
      filterModalScreen,
    )[0];
    expect(customMultiSelectCheckBox.props.selectedValues).toEqual([
      'General surgery',
    ]);
  });

  it('should get empty array for selected specialty if none is selected', () => {
    const filters = new PanelClinicFilters({});

    const filterModalScreen = renderFilterModalScreen({
      panelFilters: filters,
    });

    const customMultiSelectCheckBox = getMultiSelectCheckBox(
      filterModalScreen,
    )[0];
    expect(customMultiSelectCheckBox.props.selectedValues).toEqual([]);
  });

  it('should pass clear all button label as a prop to CustomMultiselectCheckBox', () => {
    const filterModalScreen = renderFilterModalScreen({});
    const customMultiSelectCheckBox = getMultiSelectCheckBox(filterModalScreen);

    expect(customMultiSelectCheckBox[0].props.clearAllButtonLabel).toEqual(
      messages['clearAll'],
    );
  });

  it('should pass a function as onChange prop to CustomMultiselectCheckBox', () => {
    const filterModalScreen = renderFilterModalScreen({});
    const customMultiSelectCheckBox = getMultiSelectCheckBox(filterModalScreen);

    expect(customMultiSelectCheckBox[0].props.onChange).toEqual(
      expect.any(Function),
    );
  });
});
