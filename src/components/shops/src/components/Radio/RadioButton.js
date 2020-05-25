import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Box, Text } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import PropTypes from 'prop-types';

const RadioButton = ({
  checked,
  text,
  children,
  value,
  onChange,
  textStyle,
}) => {
  const theme = useTheme();
  const handleCheck = () => {
    onChange && onChange(value);
  };

  return (
    <TouchableWithoutFeedback onPress={handleCheck}>
      <Box mb={24} flexDirection="row" alignItems="center">
        <Box
          width={20}
          height={20}
          borderRadius={10}
          borderWidth={2}
          borderColor={theme.colors.successGreen}
          justifyContent="center"
          alignItems="center"
          mr={10}
        >
          {checked && (
            <Box
              width={10}
              height={10}
              borderRadius={5}
              backgroundColor={theme.colors.successGreen}
            />
          )}
        </Box>
        {!!text && (
          <Text lineHeight={20} style={textStyle}>
            {text}
          </Text>
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
  textStyle: PropTypes.object,
};

export default RadioButton;
