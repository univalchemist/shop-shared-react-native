import { HEALTH, SHOP, PROFILE } from '@routes';

const FIREBASE_DEFAULT_VALUE = {
  admedika: {
    tabbar_config: [
      {
        visible: true,
        navigateTo: HEALTH,
        icon: 'favorite',
        i18nId: 'navigation.tab.health',
        defaultLabel: 'Lifestyle',
      },
      {
        visible: true,
        navigateTo: SHOP,
        icon: 'store',
        i18nId: 'navigation.tab.shop',
        defaultLabel: 'Choices',
      },
      {
        visible: true,
        navigateTo: PROFILE,
        icon: 'person',
        i18nId: 'navigation.tab.profile',
        defaultLabel: 'Me',
      },
    ],
  },
  default_config: {
    tabbar_config: [
      {
        visible: true,
        navigateTo: 'Health',
        icon: 'favorite',
        i18nId: 'navigation.tab.health',
        defaultLabel: 'Lifestyle',
      },
      {
        visible: true,
        navigateTo: 'Claims',
        icon: 'assignment-turned-in',
        i18nId: 'navigation.tab.claims',
        defaultLabel: 'Claims',
      },
      {
        visible: true,
        navigateTo: 'Shop',
        icon: 'store',
        i18nId: 'navigation.tab.shop',
        defaultLabel: 'Choices',
      },
      {
        visible: true,
        navigateTo: 'Profile',
        icon: 'person',
        i18nId: 'navigation.tab.profile',
        defaultLabel: 'Me',
      },
    ],
  },
};

export default FIREBASE_DEFAULT_VALUE;
