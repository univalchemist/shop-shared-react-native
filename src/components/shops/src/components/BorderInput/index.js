import React from 'react';
import { Box, PlainText } from '@shops/wrappers/components';
import styled from 'styled-components/native';
import { useTheme } from '@shops/wrappers/core/hooks';
import { TextInput } from 'react-native';
import {
  fontFamily,
  textAlign,
  lineHeight,
  fontWeight,
  fontSize,
  letterSpacing,
  color,
  space,
  fontStyle,
  marginTop,
  paddingTop,
  paddingBottom,
  flexWrap,
  width,
  marginRight,
  marginLeft,
  borderRadius,
  borderWidth,
  borderBottom,
  borderColor,
} from 'styled-system';

const StyledInput = styled(TextInput)`
    ${fontSize}
    ${fontFamily}
    ${textAlign}
    ${lineHeight}
    ${fontWeight}
    ${letterSpacing}
    ${color}
    ${space}
    ${fontStyle}
    ${marginRight}
    ${marginLeft}
    ${marginTop}
    ${paddingTop}
    ${paddingBottom}
    ${flexWrap}
    ${width}
    ${borderRadius}
    ${borderWidth}
    ${borderBottom}
    ${borderColor}
`;

export const BorderInput = Props => {
  const {
    onChangeText,
    placeholder,
    borderColor,
    value,
    optional,
    outlined,
    label,
    isError,
    color,
  } = Props;
  const theme = useTheme();
  return (
    <Box alignSelf={'center'}>
      <StyledInput
        {...Props}
        py={12}
        px={10}
        color={color}
        onChangeText={onChangeText}
        placeholder={placeholder}
        borderWidth={isError ? 2 : 1}
        value={value + ''}
        borderRadius={5}
        borderColor={isError ? theme.colors.primary[0] : theme.colors.border}
      />
      {outlined && (
        <Box
          alignItems={'center'}
          left={12}
          px={2}
          backgroundColor={theme.colors.white}
          position={'absolute'}
        >
          <PlainText color={isError && theme.colors.red} fontSize={12}>
            {label}
          </PlainText>
        </Box>
      )}
      {optional && (
        <PlainText fontSize={12} marginLeft={12}>
          {'Optional'}
        </PlainText>
      )}
    </Box>
  );
};

export default BorderInput;
