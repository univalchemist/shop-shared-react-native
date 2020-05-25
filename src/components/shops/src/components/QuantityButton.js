import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shops/wrappers/core/hooks';
import { Text } from '@shops/wrappers/components';

const QuantityButton = ({ text, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.primary[0] }]}
      onPress={onPress}
    >
      <Text fontSize={24} lineHeight={24} color={theme.colors.white}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: 56,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuantityButton;
