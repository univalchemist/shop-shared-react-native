import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Box, Text } from '@wrappers/components';
import { useTheme } from '@wrappers/core/hooks';
import PropTypes from 'prop-types';
import { PlainText } from '@cxa-rn/components';

const RadioButton = ({ checked, text, children, value, onChange, extra }) => {
  const theme = useTheme();
  const handleCheck = () => {
    onChange && onChange(value);
  };

  return (
    <TouchableWithoutFeedback onPress={handleCheck}>
      <Box mb={32} flexDirection="row" alignItems="center">
        <Box
          width={20}
          height={20}
          borderRadius={10}
          borderWidth={2}
          borderColor={checked ? theme.colors.green : theme.colors.gray[8]}
          justifyContent="center"
          alignItems="center"
          mr={10}
        >
          {checked && (
            <Box
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor={theme.colors.green}
            />
          )}
        </Box>
        {text && (
          <Box flex={1}>
            <PlainText color={theme.colors.gray[0]} lineHeight={20}>
              {text}
            </PlainText>
            {extra && <PlainText lineHeight={20}>{extra}</PlainText>}
          </Box>
        )}
        {children}
      </Box>
    </TouchableWithoutFeedback>
  );
};

RadioButton.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
  checked: PropTypes.bool,
  text: PropTypes.string,
  value: PropTypes.any,
};

export default RadioButton;
