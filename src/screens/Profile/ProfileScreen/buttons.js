import {
  PROFILE_DOCUMENTS,
  PROFILE_EHEALTH_CARD,
  PROFILE_HELP,
  PROFILE_MY_BENEFITS,
  PROFILE_MY_DETAILS,
  PROFILE_SETTINGS,
} from '@routes';

export const buttons = [
  {
    id: 'profile.navigation.eHealthCard',
    route: PROFILE_EHEALTH_CARD,
  },
  {
    id: 'profile.navigation.myBenefits',
    route: PROFILE_MY_BENEFITS,
  },
  {
    id: 'profile.navigation.myDetails',
    route: PROFILE_MY_DETAILS,
  },
  {
    id: 'profile.navigation.documents',
    route: PROFILE_DOCUMENTS,
  },
  {
    id: 'profile.navigation.help',
    route: PROFILE_HELP,
  },
  {
    id: 'profile.settings',
    route: PROFILE_SETTINGS,
  },
];
