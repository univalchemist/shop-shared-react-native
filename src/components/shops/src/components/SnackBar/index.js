import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  Animated,
  Easing,
  ViewPropTypes,
} from 'react-native';

const easingValues = {
  entry: Easing.bezier(0.0, 0.0, 0.2, 1),
  exit: Easing.bezier(0.4, 0.0, 1, 1),
};

const durationValues = {
  entry: 225,
  exit: 195,
};

const SnackBar = ({
  visible = false,
  position = 'bottom',
  containerStyle = {},
  onSnackBarHided,
  autoHidingTime = 0,
  children,
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
}) => {
  const [translateValue] = useState(new Animated.Value(0));
  const [hideDistance, setHideDistance] = useState(9999);

  const hideSnackBar = () => {
    Animated.timing(translateValue, {
      duration: durationValues.exit,
      toValue: 0,
      easing: easingValues.exit,
    }).start(()=>{
      onSnackBarHided?.();
    });
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(translateValue, {
        duration: durationValues.entry,
        toValue: 1,
        easing: easingValues.entry,
      }).start();

      if (autoHidingTime) {
        setTimeout(hideSnackBar, autoHidingTime);
      }
    } else {
      hideSnackBar();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.limitContainer,
        {
          height: translateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, hideDistance],
          }),
        },
        position === 'top' ? { top } : { bottom },
      ]}
    >
      <Animated.View
        testID={'animatedView'}
        style={[
          containerStyle,
          styles.container,
          {
            left,
            right,
          },
          {
            [position]: translateValue.interpolate({
              inputRange: [0, 1],
              outputRange: [hideDistance * -1, 0],
            }),
          },
        ]}
        onLayout={event => {
          if (!event?.nativeEvent?.layout) return;
          setHideDistance(event.nativeEvent.layout.height);
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

SnackBar.propTypes = {
  backgroundColor: PropTypes.string,
  distanceCallback: PropTypes.func,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
  bottom: PropTypes.number,
  visible: PropTypes.any,
  position: PropTypes.oneOf(['bottom', 'top']),
  autoHidingTime: PropTypes.number, // How long (in milliseconds) the snack bar will be hidden.
  containerStyle: ViewPropTypes.style,
};

const styles = StyleSheet.create({
  limitContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
  },
  textMessage: {
    fontSize: 14,
    flex: 1,
    paddingLeft: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
});

export default SnackBar;
