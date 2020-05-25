import { useIntl } from '@wrappers/core/hooks';
import { Storage, useBiometrics } from '@utils';
import { useFirebase } from '@navigations/firebaseContext';
import React, { useEffect } from 'react';
import FeatureToggle from '@config/FeatureToggle';
import {
  CLAIMS,
  DOCTOR_LANDING,
  HEALTH,
  PROFILE,
  REGISTER_BIOMETRIC_MODAL,
  SHOP,
} from '@routes';
import theme from '@theme';
import { getTabBarIcon } from '@navigations/utils';
import {
  HealthNavigator,
  DoctorNavigator,
  ProfileNavigator,
} from '@navigations';

import { ShopScreen } from '@screens/Shop';
import { ShopNavigator } from '@components/shops';
import {
  getStoreConfigs,
  getCategories,
  getSortings,
  getCart,
  getCartTotals,
  getCountries,
} from '@components/shops';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { connect } from 'react-redux';

const hideTabBarOptions = (route, options = {}) => {
  let tabBarVisible = true;

  if (route.name === SHOP) {
    return {
      tabBarVisible,
      ...options,
    };
  }
  if (route.state) {
    const { index, routes } = route.state;
    tabBarVisible = index === 0 || routes[index]?.name === DOCTOR_LANDING;
  }

  return {
    tabBarVisible,
    ...options,
  };
};

const getNavigatorMap = isActiveShopNative => ({
  [HEALTH]: HealthNavigator,
  [CLAIMS]: DoctorNavigator,
  [SHOP]: isActiveShopNative ? ShopNavigator : ShopScreen,
  [PROFILE]: ProfileNavigator,
});
const Tab = createBottomTabNavigator();
const TabNavigator = ({
  navigation,
  userId,
  getStoreConfigs,
  getCategories,
  getSortings,
  getCart,
  getCartTotals,
  getCountries,
}) => {
  const intl = useIntl();
  const { biometryType } = useBiometrics();
  const {
    remoteConfig: { tabbar_config, shop_config },
  } = useFirebase();
  const isActiveShopNative = shop_config?.whitelist_users?.includes(userId);
  const navigatorMap = getNavigatorMap(isActiveShopNative);

  useEffect(() => {
    const init = async () => {
      const registerBiometrics = await Storage.get(Storage.IS_FIRST_TIME_LOGIN);
      if (
        biometryType &&
        !registerBiometrics &&
        FeatureToggle.USE_BIOMETRICS.on
      ) {
        navigation.navigate(REGISTER_BIOMETRIC_MODAL);
      }
    };
    init();
  }, [biometryType, navigation]);

  useEffect(() => {
    if (isActiveShopNative) {
      getStoreConfigs();
      getCategories();
      getSortings();
      getCart();
      getCartTotals();
      getCountries();
    }
  }, [
    getCart,
    getCartTotals,
    getCategories,
    getCountries,
    getSortings,
    getStoreConfigs,
    isActiveShopNative,
  ]);
  if (!tabbar_config[0]) return null;
  return (
    <Tab.Navigator
      initialRouteName={tabbar_config[0].navigateTo}
      tabBarOptions={{
        activeTintColor: theme.tabbar.activeColor,
        inactiveTintColor: theme.tabbar.inactiveColor,
      }}
      screenOptions={({ route }) => {
        return {
          tabBarIcon: ({ color }) => getTabBarIcon(route.name, color),
        };
      }}
    >
      {tabbar_config.map(config => (
        <Tab.Screen
          key={config.navigateTo}
          name={config.navigateTo}
          component={navigatorMap[config.navigateTo]}
          options={({ route }) =>
            hideTabBarOptions(route, {
              title: intl.formatMessage({
                id: config.i18nId,
                defaultMessage: config.defaultLabel,
              }),
            })
          }
        />
      ))}
    </Tab.Navigator>
  );
};

const mapStateToProps = state => {
  const { userId } = state.user;

  return { userId };
};

export default connect(mapStateToProps, {
  getStoreConfigs,
  getCategories,
  getSortings,
  getCart,
  getCartTotals,
  getCountries,
})(TabNavigator);
