import * as Storage from './storage';

export { Storage };

export const noop = () => {};

export { default as getMemberMapAndOrder } from './getMemberMapAndOrder';
export { default as saveSession } from './saveSession';
export {
  default as localizeServerError,
  getLocalizeServerError,
} from './localizeServerError';
export { getImageSizeFromUri, getImageSizeRelativeToView } from './images';
export { shareDocumentIOS, shareDocumentAndroid } from './share';
export {
  IPHONEX_BOTTOM_PADDING,
  isIphoneX,
  NAVIGATOR_HEIGHT,
} from './isIphoneX';
export { showConfirmation, debounceAlert } from './alerts';
export { IsEmployee, IsDependent } from './roles';
export { mapCurrencyCodeToSymbol } from './currency';
export { checkJailBroken } from './jailbreak';
export {
  GetDisplayRelationship,
  IsCategorySpouse,
  IsCategoryChild,
} from './relationships';
export { isFunc, isNotEmpty } from './is';
export {
  getFormattedDate,
  getFormattedDateWithMonthAndDay,
  getDateDuration,
  getAgeInDays,
  getYearsAgo,
} from './date';
export { bootstrap, useFirebaseRemoteConfig } from './firebase';
export { isTerminatedOrExtended, isOnExtendedTime } from './isTerminated';
export { useBiometrics, getBiometricDeviceType } from './biometrics';
