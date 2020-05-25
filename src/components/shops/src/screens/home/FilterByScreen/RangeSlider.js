import React from 'react';
import { StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useTheme } from '@shops/wrappers/core/hooks';

const RangeSlider = ({
  values,
  sliderLength,
  onValuesChange,
  max,
  min = 0,
  step = 1,
}) => {
  const theme = useTheme();

  return (
    <MultiSlider
      values={values}
      sliderLength={sliderLength}
      onValuesChange={onValuesChange}
      max={max}
      min={min}
      step={step}
      snapped
      markerStyle={[
        styles.marker,
        {
          backgroundColor: theme.colors.primary[0],
          borderColor: theme.colors.primary[0],
        },
      ]}
      pressedMarkerStyle={[
        styles.marker,
        {
          backgroundColor: theme.colors.primary[0],
          borderColor: theme.colors.primary[0],
        },
      ]}
      selectedStyle={{ backgroundColor: theme.colors.primary[0] }}
      unselectedStyle={{ backgroundColor: theme.colors.sliderDisabled }}
    />
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default RangeSlider;
