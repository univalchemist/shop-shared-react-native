import React, { useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView } from 'react-native';

import { Box, PlainText } from '@wrappers/components';
import { TabView, TabBar } from 'react-native-tab-view';

import theme from '@theme';
import { DoctorLandingScreen } from '@screens/Panel';
import AppointmentListingScreen from '@heal/src/screens/Appointment/AppointmentListingScreen';
import MedicationScreen from '@heal/src/screens/Medication/MedicationScreen';
import { useIntl } from '@wrappers/core/hooks';

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: theme.colors.primary[0],
    width: '15%',
    height: 4,
    marginLeft: 13,
  },
  tabTextStyle: {
    fontSize: theme.fontSizes[2],
    paddingTop: 15,
    paddingBottom: 5,
  },
  tabBarStyle: {
    backgroundColor: theme.backgroundColor.default,
    marginLeft: 5,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  tabStyle: {
    width: 'auto',
    marginLeft: 26,
  },
});

const HealTabNavigator = ({ navigation, route }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const routeVal = route;
  const intl = useIntl();
  const routes = [
    {
      key: 'doctor',
      title: intl.formatMessage({
        id: 'healTabNavigator.findDoctor',
      }),
    },
    {
      key: 'appointment',
      title: intl.formatMessage({
        id: 'healTabNavigator.appointment',
      }),
    },
    {
      key: 'medication',
      title: intl.formatMessage({
        id: 'healTabNavigator.medication',
      }),
    },
  ];

  const tabState = {
    routes,
    index: tabIndex,
  };
  const renderLabel = ({ route, focused }) => {
    return (
      <Box>
        <PlainText
          style={[
            styles.tabTextStyle,
            focused
              ? { color: theme.colors.gray[0] }
              : { color: theme.heal.colors.gray[0] },
          ]}
        >
          {route.title}
        </PlainText>
      </Box>
    );
  };

  return (
    <Box bg={theme.colors.red} as={SafeAreaView} flex={1}>
      <Box height="100%" backgroundColor={theme.heal.colors.backgroundColor}>
        <Box flexGrow={1}>
          <TabView
            navigationState={tabState}
            renderScene={({ route }) => {
              switch (route.key) {
                case 'doctor':
                  return <DoctorLandingScreen navigation={navigation} />;
                case 'appointment':
                  return (
                    <AppointmentListingScreen
                      navigation={navigation}
                      route={routeVal}
                    />
                  );
                case 'medication':
                  return <MedicationScreen />;
                default:
                  return null;
              }
            }}
            onIndexChange={index => {
              setTabIndex(index);
            }}
            renderTabBar={props => (
              <TabBar
                {...props}
                renderLabel={renderLabel}
                indicatorStyle={styles.indicatorStyle}
                style={styles.tabBarStyle}
                tabStyle={styles.tabStyle}
                indicatorContainerStyle={{ marginLeft: 20 }}
                scrollEnabled
              />
            )}
            initialLayout={{
              width: Dimensions.get('window').width,
            }}
            style={{
              backgroundColor: theme.backgroundColor.default,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HealTabNavigator;
