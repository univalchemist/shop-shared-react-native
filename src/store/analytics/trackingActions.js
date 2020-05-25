import analytics from '@react-native-firebase/analytics';
import { getActiveRouteName } from './utils';

export const firebaseAnalytics = analytics();

export const categories = {
  HOME: 'Home screen',
  HEALTH_QUESTION: 'Health questionnaire',
  LIFESTYLE_OVERVIEW: 'My lifestyle overview',
  PANEL_CLINICS: 'Panel clinics',
  PANEL_CLINIC_DETAILS: 'Panel clinic details',
  PANEL_CLINIC_FILTER: 'Panel clinic filter',
  PANEL_CLINIC_SEARCH: 'Panel clinic search',
  CLAIMS: 'Claims',
  CLAIMS_FILTER: 'Claims filter',
  CLAIMS_SUBMISSION: 'Claims submission',
  PROFILE: 'Profile',
  PROFILE_E_HEALTH_CARD: 'Profile, e-health card',
  PROFILE_BENEFITS_SUMMARY: 'Profile, benefits summary',
  PROFILE_USEFUL_DOCUMENTS: 'Profile, useful documents',
  PROFILE_MY_DETAILS: 'Profile, my details',
  PROFILE_HELP: 'Profile, help',
  PROFILE_SETTINGS: 'Profile, settings',
  CHOICES: 'Choices',
  CHOICES_CATEGORY: 'Choices category',
  CHOICES_CATEGORY_VIEW: 'Choices, category view',
  CHOICES_SEARCH_RESULTS: 'Choices, search results',
  CHOICES_PRODUCT_DETAILS: 'Choices, product details',
  CHOICES_PRODUCT_ALL_REVIEW: 'Choices, product all reviews',
  CHOICES_PROVIDER_PAGE: 'Choice, provider page',
  CHOICES_CHECKOUT: 'Choices, checkout',
  CHOICES_CHECKED_OUT: 'Choices, checked out',
  CHOICES_ORDER_HISTORY: 'Choices, order history',
};

export const benefitProductType = {
  Outpatient: 'Outpatient',
  HospitalSurgical: 'Hospital & Surgical',
  SupplementalMajorMedical: 'Supplementary major medical',
  MaternitySubsidy: 'Maternity subsidy',
  WellnessFlexibleSpending: 'Wellness FSA',
};

export const trackUserInfo = async ({ userId, clientId }) => {
  await Promise.all([
    firebaseAnalytics.setUserId(userId),
    firebaseAnalytics.setUserProperty('client_id', clientId),
  ]);
};

export const trackUserType = async userType => {
  await firebaseAnalytics.setUserProperty('user_type', userType);
};

export const logLogin = async () =>
  await firebaseAnalytics.logLogin({
    method: 'simple authentication',
  });

export const logLogout = async ({ clientId, userId }) =>
  await logEvent({ event: 'logout', eventParams: { clientId, userId } });

export const trackScreenView = async screen => {
  // Set & override the MainActivity screen name
  await firebaseAnalytics.setCurrentScreen(screen, screen);
};

export const logEvent = async ({ event, eventParams }) => {
  await firebaseAnalytics.logEvent(event, eventParams);
};

export const logAction = async ({ category, action, ...restParams }) => {
  await logEvent({
    event: 'user_action',
    eventParams: {
      category,
      action,
      ...restParams,
    },
  });
};
