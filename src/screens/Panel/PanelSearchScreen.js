import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import theme from '@theme';
import PanelClusteredMapView from './widgets/PanelClusteredMapView';
import styled from 'styled-components/native';
import { View, Text, Platform, TouchableOpacity, Keyboard } from 'react-native';
import {
  fetchPanelClinics,
  removeAllFilters,
  updateFilter,
} from '@store/panel/actions';
import React, { useEffect, useState, useRef } from 'react';
import { Alert, Dimensions } from 'react-native';
import { injectIntl } from 'react-intl';
import { Card } from 'react-native-elements';
import ClinicCard from './widgets/clinicCards/ClinicCard';
import { TabView, TabBar } from 'react-native-tab-view';
import PanelListView from './widgets/PanelListView';
import { SearchBar } from 'react-native-elements';
import { Flex, Image, Box, StackBackButton } from '@wrappers/components';
import { Storage, isIphoneX } from '@utils';
import { HEALTH, FILTER_MODAL } from '@routes';
import { SearchModal } from './searchModal/SearchModal';
import { filterImage, selectedFilterImage } from '@images';
import { FilterTypes } from './utils/filter';
import { categories, logAction } from '@store/analytics/trackingActions';
import { useBackButtonHandler } from '@wrappers/core/hooks';

const mapStateToProps = ({
  panel: { defaultLocation, clinics, filteredClinics, selectedClinic, filters },
}) => ({
  defaultLocation,
  clinics,
  filteredClinics,
  selectedClinic,
  hasSpecialtyFilter: filters.hasFilter(FilterTypes.SPECIALTY),
});

const mapDispatchToProps = {
  fetchPanelClinics,
  removeAllFilters,
  updateFilter,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
);
export const BackButton = ({ handlePress }) => (
  <TouchableOpacity onPress={() => handlePress()}>
    <StackBackButton style={{ paddingRight: 0, paddingLeft: 0 }} />
  </TouchableOpacity>
);

export const FilterButton = ({
  onPress,
  hasSpecialtyFilter,
  hasTitle,
  intl,
}) => (
  <TouchableOpacity onPress={onPress}>
    <Image source={hasSpecialtyFilter ? selectedFilterImage : filterImage} />
    {hasTitle && intl && (
      <Text adjustsFontSizeToFit>
        {intl.formatMessage({
          id: 'filterModalScreenTitle',
          defaultMessage: 'Filter',
        })}
      </Text>
    )}
  </TouchableOpacity>
);

export const NoResultCard = intl => (
  <Card>
    <Text>
      {intl.formatMessage({
        id: 'panelSearch.noResult',
      })}
    </Text>
  </Card>
);

export const MapViewContainer = styled.View`
  height: 70%;
  width: 100%;
`;

export const MapView = ({ navigation, buttonPressCount }) => {
  const [mapViewLayout, setMapViewLayout] = useState(undefined);
  return (
    <View style={{ flex: 1 }}>
      <MapViewContainer
        onLayout={event => setMapViewLayout(event.nativeEvent.layout)}
      >
        {mapViewLayout && (
          <PanelClusteredMapView
            buttonPressCount={buttonPressCount}
            dimension={mapViewLayout}
          />
        )}
      </MapViewContainer>
      <View style={{ height: '30%' }}>
        <ClinicCard navigation={navigation} />
      </View>
    </View>
  );
};

export const PanelSearchScreen = ({
  navigation,
  fetchPanelClinics,
  updateFilter,
  removeAllFilters,
  clinics,
  filteredClinics,
  intl,
  hasSpecialtyFilter,
}) => {
  const shouldFetchClinics = !(clinics && clinics.length > 0);

  const [buttonPressCount, updateButtonPressCount] = useState(0);
  const [searchTerm, updateSearchTerm] = useState('');
  const [successfulSearchTerm, updateSuccessfulSearchTerm] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [getRecentSearches, setRecentSearches] = useState([]);
  const searchBarRef = useRef(null);

  const handleBackButtonPress = () => {
    if (showSearchModal) {
      setShowSearchModal(false);
      searchBarRef.current.cancel();
      return true;
    }

    return false;
  };

  useBackButtonHandler(handleBackButtonPress);

  const filterHandler = filter => {
    setShowSearchModal(false);
    Keyboard.dismiss();
    updateFilter(filter);
    logAction({
      category: categories.PANEL_CLINIC_SEARCH,
      action: 'Filter search',
    });
  };

  useEffect(() => {
    const asyncStorage = async () => {
      const searchTerms = await Storage.get('recentSearches');
      if (searchTerms !== null) {
        setRecentSearches(JSON.parse(searchTerms));
      }
    };
    asyncStorage();
  }, []);

  useEffect(() => {
    return () => {
      removeAllFilters();
    };
  }, [removeAllFilters]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        await fetchPanelClinics();
      } catch (error) {
        Alert.alert(
          intl.formatMessage({
            id: 'serverErrors.fetchPanelClinics.subject',
          }),
          intl.formatMessage({
            id: 'serverErrors.fetchPanelClinics.default',
          }),
        );
      }
    };
    if (shouldFetchClinics) {
      fetchClinics();
    }
  }, [intl, fetchPanelClinics, shouldFetchClinics]);

  const routes = [
    {
      key: 'mapView',
      title: intl.formatMessage({ id: 'panelSearch.TabType.Map' }),
      accessibilityLabel: 'Map Tab',
      trackingAction: 'Map view',
    },
    {
      key: 'listView',
      title: intl.formatMessage({ id: 'panelSearch.TabType.List' }),
      accessibilityLabel: 'List Tab',
      trackingAction: 'List view',
    },
  ];

  const tabState = {
    routes,
    index: tabIndex,
  };

  const labelStyle = {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray[0],
    lineHeight: theme.lineHeights[4],
    fontWeight: theme.fontWeights.bold.toString(),
    textTransform: 'capitalize',
  };

  const updateTheSearchBar = () => {
    searchBarRef.current.searchbar.onChangeText(successfulSearchTerm);
  };

  const saveToLocalStorage = async option => {
    const maxSearchTerms = 4;
    const recentSearches = getRecentSearches;
    const indexOfDuplicate = recentSearches.findIndex(
      searchOption => searchOption.label === option.label,
    );
    if (indexOfDuplicate !== -1) {
      recentSearches.splice(indexOfDuplicate, 1);
    }
    recentSearches.length === maxSearchTerms
      ? recentSearches.pop()
      : recentSearches;
    recentSearches.unshift(option);
    await Storage.save('recentSearches', JSON.stringify(recentSearches));
    setRecentSearches(recentSearches);
  };

  return (
    <Box
      height="100%"
      paddingTop={isIphoneX() ? 35 : 15}
      backgroundColor="white"
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        {showSearchModal === false && (
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
          >
            <BackButton
              handlePress={() => {
                navigation.navigate(HEALTH);
              }}
            />
          </Box>
        )}
        <SearchBar
          ref={searchBarRef}
          cancelButtonTitle={intl.formatMessage({
            id: 'panelSearch.cancelButtonText',
          })}
          containerStyle={{
            flex: 6.5,
            backgroundColor: 'white',
          }}
          inputContainerStyle={
            showSearchModal
              ? {
                  marginLeft: 8,
                }
              : {
                  marginLeft: 0,
                  marginRight: 0,
                }
          }
          placeholder={intl.formatMessage({
            id: 'panelSearch.placeholder',
          })}
          onChangeText={value => {
            updateSearchTerm(value);
          }}
          value={searchTerm}
          platform={Platform.OS}
          returnKeyType="search"
          onFocus={() => {
            setShowSearchModal(true);
          }}
          onCancel={() => {
            setTimeout(() => {
              setShowSearchModal(false);
              updateTheSearchBar();
            });
          }}
          onClear={() => {
            setShowSearchModal(true);
            searchBarRef.current.focus();
          }}
          onSubmitEditing={() => {
            filterHandler({
              type: FilterTypes.SEARCH_ALL,
              values: [searchTerm],
            });
            updateSuccessfulSearchTerm(searchTerm);
            saveToLocalStorage({
              label: searchTerm,
              filter: { type: FilterTypes.SEARCH_ALL, values: [searchTerm] },
            });
          }}
        />
        {!showSearchModal && (
          <Box
            flex={1.2}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <FilterButton
              onPress={() => {
                navigation.navigate(FILTER_MODAL);
                logAction({
                  category: categories.PANEL_CLINICS,
                  action: 'Click on filter clinics button',
                });
              }}
              intl={intl}
              hasTitle
              hasSpecialtyFilter={hasSpecialtyFilter}
            />
          </Box>
        )}
      </Flex>
      <Box flexGrow={1} style={showSearchModal ? { display: 'none' } : {}}>
        <TabView
          navigationState={tabState}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'listView':
                return (
                  <PanelListView
                    clinics={filteredClinics}
                    navigation={navigation}
                  />
                );
              case 'mapView':
                return (
                  <MapView
                    buttonPressCount={buttonPressCount}
                    navigation={navigation}
                  />
                );
              default:
                return null;
            }
          }}
          onIndexChange={index => {
            setTabIndex(index);
            if (tabState.routes[index]) {
              logAction({
                category: categories.PANEL_CLINICS,
                action: tabState.routes[index].trackingAction,
              });
            }
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor: theme.colors.primary[0],
              }}
              style={{
                backgroundColor: theme.colors.white,
              }}
              labelStyle={labelStyle}
            />
          )}
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          style={{ backgroundColor: theme.backgroundColor.default }}
        />
      </Box>
      {showSearchModal === true && (
        <SearchModal
          getRecentSearches={getRecentSearches}
          updateSearchTerm={updateSearchTerm}
          updateButtonPressCount={updateButtonPressCount}
          updateSuccessfulSearchTerm={updateSuccessfulSearchTerm}
          buttonPressCount={buttonPressCount}
          clinics={clinics}
          updateFilter={filterHandler}
          saveToLocalStorage={saveToLocalStorage}
        />
      )}
    </Box>
  );
};

PanelSearchScreen.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  defaultLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    latitudeDelta: PropTypes.number,
    longitudeDelta: PropTypes.number,
  }),
  clinics: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
      specialty: PropTypes.string,
      area: PropTypes.string,
      district: PropTypes.string,
    }),
  ),
  filteredClinics: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
      specialty: PropTypes.string,
      area: PropTypes.string,
      district: PropTypes.string,
    }),
  ),
  selectedClinic: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
    specialty: PropTypes.string,
    area: PropTypes.string,
    district: PropTypes.string,
  }),
  fetchPanelClinics: PropTypes.func,
  removeAllFilters: PropTypes.func,
  updateFilter: PropTypes.func,
};

export default enhance(PanelSearchScreen);
