import { Platform } from 'react-native';
import shopTheme from '@shops/theme';
import healTheme from '@heal/theme';

const colors = {
  primary: ['#DB0011', '#AD0012', '#ffcccf'],
  secondary: ['#2f3494', '#648be7', '#cfe1ff'],
  gray: [
    '#212121',
    '#646464',
    '#727272',
    '#9a9a9a',
    '#b8b8b8',
    '#e3e3e3',
    '#f0f0f0',
    '#f9f9f9',
    '#666666',
    '#f2f2f2',
    '#ededed',
  ],
  success: ['#03A450', '#77b03c', '#dff0d8'],
  warning: ['#935c01', '#ffae28', '#fdf1b2', '#F4511E'],
  error: ['#b00020', '#f6710a', '#fcd1b9', '#d7d8d6'],
  info: ['#31707e', '#1d5b6a', '#d9edf7'],
  black: '#000000',
  white: '#ffffff',
  blue: ['#0275d8', '#afdaff', '#3a98c9', '#294B71'],
  transparent: 'transparent',
  fonts: {
    link: '#0275D8',
    blackLink: '#333333',
  },
  amber: ['#FF9900'],
  red: ['#DB0011'],
  green: ['#00847F'],
};

colors.backgroundColor = colors.gray[7];
colors.buttonPrimary = colors.primary[0];
colors.buttonPrimaryPressed = colors.primary[1];
colors.touchableOverlayColor = colors.gray[6];
colors.riskAmber = colors.amber[0];
colors.riskRed = colors.red[0];
colors.riskGreen = colors.green[0];
colors.imageHeaderMatching = colors.gray[9];
colors.defaultText = '#333333';

const backgroundColor = {
  default: colors.gray[7],
};
const inputField = {
  inputText: colors.gray[1],
  inputBorder: colors.black,
  inputBorderUntouched: colors.gray[3],
  inputFocus: colors.blue[0],
  rightText: 'rgba(0, 0, 0, 0.38)',
  disabledBorder: '#d1d1d1',
  disabledText: 'rgba(0, 0, 0, 0.38)',
};
const healthScoreGraphicColors = {
  lowScore: colors.primary[0],
  averageScore: colors.warning[1],
  highScore: colors.success[0],
  default: colors.gray[5],
  none: colors.transparent,
};
const tabbar = {
  activeTextColor: '#DB0011',
  activeColor: '#DB0011',
  inactiveColor: '#bdbdbd',
};
const checkBox = {
  text: colors.gray[0],
  checked: colors.blue[0],
  unchecked: colors.gray[3],
};
const radioButton = {
  checked: '#00847f',
};

const terminatedLabel = {
  backgroundColor: 'rgba(233, 161, 21, 0.1)',
};

const breakpoints = ['420px', '740px', '980px', '1300px'];

// space is used for margin and padding scales
// it's recommended to use powers of two to ensure alignment
// when used in nested elements
// numbers are converted to px
const space = [0, 4, 8, 16, 32, 64, 128];

// typographic scale
const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 96, 128];

// for any scale, either array or objects will work
const lineHeights = [1, 1.125, 1.25, 1.5, 20, 37];

const fonts = {
  default: 'Arial',
};

const fontWeights = {
  light: 300,
  normal: 500,
  bold: 700,
  bolder: Platform.OS === 'ios' ? 800 : 'bold',
};

const letterSpacings = {
  normal: 'normal',
  caps: '0.25em',
};

// border-radius
const radii = [0, 2, 4, 8];

const borders = [0, '1px solid', '2px solid'];

const shadows = [
  `0 1px 2px 0 ${colors.gray[3]}`,
  `0 1px 4px 0 ${colors.gray[3]}`,
];

const customInputStyles = {
  customLabelStyles: {
    color: colors.fonts.blackLink,
  },
  customFocusedLabelStyles: {
    color: colors.fonts.blackLink,
  },
  customHintStyles: { color: colors.fonts.blackLink },
};
const modal = {
  text: colors.white,
  errorText: '#F4511E',
  cancelText: '#00847F',
};
const theme = {
  modal,
  breakpoints,
  colors,
  backgroundColor,
  inputField,
  healthScoreGraphicColors,
  checkBox,
  space,
  fontSizes,
  fonts,
  lineHeights,
  fontWeights,
  letterSpacings,
  radii,
  borders,
  shadows,
  radioButton,
  tabbar,
  terminatedLabel,
  customInputStyles,
  shop: shopTheme,
  heal: healTheme,
};

export default theme;
