import React from 'react';
import { View, ViewPropTypes, Platform, ActivityIndicator } from 'react-native';
import Spinner from 'react-native-spinkit';
import theme from '@theme';

const SpinningLoader = ({ style }) => {
  if (Platform.OS === 'ios') {
    return (
      <View style={[styles.spinnerStyle, style]}>
        <Spinner
          isVisible={true}
          color={theme.heal.colors.crimson}
          size={36}
          type={'Arc'}
        />
      </View>
    );
  }

  return (
    <View style={[styles.spinnerStyle, style]}>
      <ActivityIndicator size={36} color={theme.heal.colors.crimson} />
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

SpinningLoader.propTypes = {
  style: ViewPropTypes.style,
};

SpinningLoader.defaultProps = {
  style: {},
};

export default SpinningLoader;
