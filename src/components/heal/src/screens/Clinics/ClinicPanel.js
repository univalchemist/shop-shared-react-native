import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { RESULTS } from 'react-native-permissions';

import { Box, ErrorPanel, Flex } from '@wrappers/components';
import { StackBackButton } from '@heal/src/components';
import { DOCTOR_LANDING, HEALTH, UNIFY_SEARCH } from '@routes';
import { TabView, TabBar } from 'react-native-tab-view';
import { isIphoneX } from '@utils';
import ClinicListing from './ClinicListing';
import { MapView } from '@heal/src/screens/Clinics/MapView';
import {
  getClinics,
  fetchLocation,
  updateSelectedClinics,
  updateSelectedClinic,
} from '@heal/src/store/actions';
import { checkLocationPermission } from '@heal/src/utils/location';

import theme from '@theme';
import NonTouchableSearchBar from '@heal/src/components/NonTouchableSearchBar';
import { useIntl } from '@wrappers/core/hooks';

const styles = StyleSheet.create({
  clinicGroups: {
    flex: 1,
  },
  labelStyle: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray[0],
    lineHeight: theme.lineHeights[4],
    fontWeight: theme.fontWeights.bold.toString(),
    textTransform: 'capitalize',
  },
  backButton: { paddingRight: 0, paddingLeft: 0 },
  searchContainer: { flex: 6.5, backgroundColor: 'white' },
  searchInputContainer: { marginLeft: 0, marginRight: 0 },
});

export const BackButton = ({ handlePress }) => (
  <TouchableOpacity onPress={() => handlePress()}>
    <StackBackButton style={styles.backButton} />
  </TouchableOpacity>
);

const ClinicPanel = ({
  navigation,
  getClinics,
  fetchLocation,
  route,
  updateSelectedClinics,
  updateSelectedClinic,
  changedLocation,
}) => {
  const [tabIndex, setTabIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const searchTerm = useRef(null);
  const searchBy = useRef(null);

  const intl = useIntl();
  const routes = [
    {
      key: 'mapView',
      title: 'Map',
      accessibilityLabel: 'Map Tab',
      trackingAction: 'Map view',
    },
    {
      key: 'listView',
      title: 'List',
      accessibilityLabel: 'List Tab',
      trackingAction: 'List view',
    },
  ];

  const tabState = {
    routes,
    index: tabIndex,
  };

  useEffect(() => {
    const fun = async () => {
      const result = await checkLocationPermission();
      if (result === RESULTS.GRANTED) await fetchLocation();

      const st = route?.params?.searchTerm;
      const sb = route?.params?.searchBy;
      if (searchBy.current || searchTerm.current) setTabIndex(1);
      if (st) searchTerm.current = st;
      if (sb) searchBy.current = sb;
      getClinicsCB();
    };

    fun();
  }, [route, getClinicsCB]);

  const getClinicsCB = useCallback(
    async (forceReload = false) => {
      setIsLoading(true);
      await getClinics({
        searchTerm: searchTerm.current,
        searchBy: searchBy.current,
        forceReload,
      });
      setIsLoading(false);
    },
    [getClinics],
  );

  return (
    <Box bg={theme.colors.white} as={SafeAreaView} flex={1}>
      <Box height="100%" backgroundColor={theme.heal.colors.backgroundColor}>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          backgroundColor={theme.colors.white}
          py={12}
        >
          <Box
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            pl={Platform.OS === 'ios' ? 7 : 15}
            pr={10}
          >
            <StackBackButton
              onPress={() => {
                navigation.goBack();
                updateSelectedClinics([]);
                updateSelectedClinic([]);
              }}
            />
          </Box>
          <NonTouchableSearchBar
            onPress={() => navigation.navigate(UNIFY_SEARCH)}
            mr={34}
            placeholder={intl.formatMessage({
              id: 'doctorSearch.placeholder',
            })}
          />
        </Flex>
        <Box flexGrow={1}>
          <TabView
            navigationState={tabState}
            renderScene={({ route }) => {
              switch (route.key) {
                case 'listView':
                  return (
                    <ClinicListing
                      navigation={navigation}
                      getClinics={getClinicsCB}
                      isLoading={isLoading}
                    />
                  );
                case 'mapView':
                  return <MapView Index={tabIndex} navigation={navigation} />;
                default:
                  return null;
              }
            }}
            onIndexChange={async index => {
              if (index === 1) {
                await fetchLocation();
                if (changedLocation) {
                  getClinicsCB(true);
                }
              }
              setTabIndex(index);
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
                labelStyle={styles.labelStyle}
              />
            )}
            initialLayout={{
              width: Dimensions.get('window').width,
            }}
            style={{ backgroundColor: theme.backgroundColor.default }}
          />
        </Box>
      </Box>
    </Box>
  );
};

ClinicPanel.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

const mapStateToProps = ({
  heal: {
    location: { changedLocation },
  },
}) => ({
  changedLocation,
});

export default connect(mapStateToProps, {
  fetchLocation,
  getClinics,
  updateSelectedClinics,
  updateSelectedClinic,
})(ClinicPanel);
