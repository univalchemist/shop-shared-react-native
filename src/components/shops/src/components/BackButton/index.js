import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Text, Icon } from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';

export const BackButton = ({ navigation, labelId = 'shop.common.back' }) => {
  const intl = useIntl();
  return (
    <Box px={12} py={12}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation?.goBack()}
      >
        <Box flexDirection="row">
          <Icon name="keyboard-arrow-left" />
          <Text fontSize={16}>
            {intl.formatMessage({
              id: labelId,
              defaultMessage: 'Back',
            })}
          </Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { width: 50 },
});

export default BackButton;
