import React from 'react';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { ShowAllClinicsButton } from './ShowAllClinicsButton';
import { NearMeButton } from './NearMeButton';
import { RecentSearchItem } from './RecentSearchItem';
import { ListHeader, Box } from '@wrappers/components';
import { AreaDistrictItem } from './AreaDistrictItem';
import { getAreaDistrictList } from '../utils/getAreaDistrictList';
import * as FilterTypes from '../utils/filter/FilterTypes';
import { categories } from '@store/analytics/trackingActions';

const orderedDataList = (intl, clinics, getRecentSearches) => {
  return [
    {
      title: 'Other options',
      data: ['Near me', 'Show all clinics'],
    },
    {
      title: intl.formatMessage({ id: 'panelSearch.recentSearches' }),
      data: getRecentSearches,
    },
    ...getAreaDistrictList(intl, clinics),
  ];
};

const renderSectionHeader = theme => ({ section: { title, data } }) => {
  return (
    data.length !== 0 &&
    title !== 'Other options' && (
      <ListHeader
        text={title}
        accessibilityLabel={title}
        style={{ backgroundColor: theme.colors.backgroundColor }}
        paddingTop={24}
      />
    )
  );
};

const renderSectionListItems = ({
  intl,
  buttonCount,
  updateSearchTerm,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  updateFilter,
  saveToLocalStorage,
}) => ({ item, index, section }) => {
  const isNearMe = section.title === 'Other options' && item === 'Near me';
  const isShowAllClinics =
    section.title === 'Other options' && item === 'Show all clinics';
  const isRecentSearches =
    section.title === intl.formatMessage({ id: 'panelSearch.recentSearches' });
  const isArea =
    section.title === intl.formatMessage({ id: 'panelSearch.search.areas' });
  const isDistrict =
    section.title.split('-')[0].trim() ===
    intl.formatMessage({ id: 'panelSearch.search.districts' });

  const actionParams = {
    category: categories.PANEL_CLINIC_SEARCH,
    action: 'Filter search',
  };

  if (isNearMe) {
    return (
      <NearMeButton
        buttonCount={buttonCount}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
        actionParams={actionParams}
      />
    );
  } else if (isShowAllClinics) {
    return (
      <ShowAllClinicsButton
        buttonCount={buttonCount}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
        actionParams={actionParams}
      />
    );
  } else if (isRecentSearches) {
    return (
      <RecentSearchItem
        item={item}
        buttonCount={buttonCount}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
        saveToLocalStorage={saveToLocalStorage}
        actionParams={actionParams}
      />
    );
  } else if (isArea || isDistrict) {
    return (
      <AreaDistrictItem
        index={index}
        item={item}
        section={section}
        buttonCount={buttonCount}
        updateSearchTerm={updateSearchTerm}
        updateButtonPressCount={updateButtonPressCount}
        updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
        updateFilter={updateFilter}
        saveToLocalStorage={saveToLocalStorage}
        actionParams={actionParams}
      />
    );
  }
};

export const SearchModal = ({
  updateSearchTerm,
  buttonPressCount,
  updateButtonPressCount,
  updateSuccessfulSearchTerm,
  updateFilter,
  clinics,
  getRecentSearches,
  saveToLocalStorage,
}) => {
  const buttonCount = buttonPressCount;
  const theme = useTheme();
  const intl = useIntl();

  return (
    <View
      flex={1}
      height="100%"
      style={{ backgroundColor: theme.colors.backgroundColor }}
    >
      <SectionList
        ListFooterComponent={<Box pt={'80%'} />}
        renderItem={renderSectionListItems({
          intl,
          buttonCount,
          updateSearchTerm,
          updateButtonPressCount,
          updateSuccessfulSearchTerm,
          updateFilter,
          saveToLocalStorage,
        })}
        renderSectionHeader={renderSectionHeader(theme)}
        sections={orderedDataList(intl, clinics, getRecentSearches)}
        keyExtractor={(item, index) => item + index}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};

SearchModal.propTypes = {
  clinics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      area: PropTypes.string,
      district: PropTypes.string,
    }),
  ),
  updateSearchTerm: PropTypes.func.isRequired,
  buttonPressCount: PropTypes.number.isRequired,
  updateButtonPressCount: PropTypes.func.isRequired,
  updateSuccessfulSearchTerm: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  saveToLocalStorage: PropTypes.func.isRequired,
  getRecentSearches: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      filter: PropTypes.shape({
        type: PropTypes.oneOf(
          Object.keys(FilterTypes).map(i => FilterTypes[i]),
        ),
        values: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  ),
};
