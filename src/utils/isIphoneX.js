import { Dimensions, Platform } from 'react-native';

const IPHONEX_BOTTOM_PADDING = 34;

const isIphoneX = () => {
  const dim = Dimensions.get('window');

  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
};

const isIPhoneXSize = dim => {
  return dim.height === 812 || dim.width === 812;
};

const isIPhoneXrSize = dim => {
  return dim.height === 896 || dim.width === 896;
};

export const STATUS_BAR_HEIGHT = isIphoneX() ? 44 : 20;
export const TAB_BAR_HEIGHT = isIphoneX() ? 60 + IPHONEX_BOTTOM_PADDING : 60;
const NAVIGATOR_HEIGHT = isIphoneX() ? 88 : 44;

export { IPHONEX_BOTTOM_PADDING, isIphoneX, NAVIGATOR_HEIGHT };
