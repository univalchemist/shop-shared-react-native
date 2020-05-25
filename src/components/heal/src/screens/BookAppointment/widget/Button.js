import React from 'react';
import { Box, Button as CoreButton } from '@cxa-rn/components';
import { useTheme } from '@wrappers/core/hooks';

const Button = ({ value, title, onPress }) => {
  const theme = useTheme();
  return (
    <Box
      backgroundColor={theme.colors.white}
      bottom={0}
      width="100%"
      borderTopWidth={1}
      borderTopColor={theme.colors.gray[10]}
      paddingHorizontal={32}
      paddingVertical={16}
    >
      <CoreButton
        buttonStyle={{
          backgroundColor: theme.colors.primary[0],
        }}
        disabledStyle={{
          backgroundColor: theme.colors.primary[0],
          opacity: value ? 1 : 0.5,
        }}
        disabledTitleStyle={{
          color: theme.colors.white,
        }}
        disabled={!value}
        title={title}
        onPress={onPress}
      />
    </Box>
  );
};

export default Button;
