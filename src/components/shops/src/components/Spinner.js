import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import themeParent from '@theme';

const Spinner = ({ size }) => {
  const theme = themeParent.shop;
  return <ActivityIndicator size={size} color={theme.colors.secondary} />;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['large', 'small']),
};

Spinner.defaultProps = {
  size: 'large',
};

export default Spinner;
