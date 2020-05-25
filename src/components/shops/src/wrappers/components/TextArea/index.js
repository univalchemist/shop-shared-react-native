import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input as ReactElementsInput, Icon } from 'react-native-elements';
import styled, { withTheme } from 'styled-components/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { setRefs } from '@cxa-rn/core';
import { Box } from '@shops/wrappers/components';

const getStyles = theme =>
  StyleSheet.create({
    inputContainerStyle: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.inputField.inputBorderUntouched,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 4,
      position: 'absolute',
    },
    inputContainerFocused: {
      borderColor: theme.inputField.inputFocus,
      borderWidth: 2,
      borderBottomWidth: 2,
    },
    error: {
      borderColor: theme.colors.error[0],
      borderWidth: 2,
      borderBottomWidth: 2,
    },
    errorLabel: {
      color: theme.colors.error[0],
    },
    inputStyle: {
      textAlignVertical: 'top',
      marginTop:10

    },
    containerStyle: {
      minHeight: 100,
      paddingLeft: 0,
      paddingRight: 0,
    },
    label: {
      color: theme.inputField.inputText,
      left: 16,
      top: 18,
      paddingLeft: 3,
      paddingRight: 3,
      backgroundColor: theme.backgroundColor.default,
      borderRadius: 4,
      fontSize: 18,
    },
    blue: {
      color: theme.inputField.inputFocus,
    },
    labelTop: {
      color: theme.inputField.inputBorder,
      fontSize: 12,
      top: -7,
      left: 16,
      paddingLeft: 3,
      paddingRight: 3,
      backgroundColor: theme.backgroundColor.default,
      borderRadius: 4,
    },
    labelView: {
      display: 'flex',
      flexDirection: 'row',
    },
    errorMessage: {
      top: 60,
      left: 16,
      color: theme.colors.error[0],
      position: 'absolute',
    },
    labelOpacity: {
      zIndex: 1000,
    },
    touchOpacity: {
      zIndex: 1001,
    },
    leftIconContainerStyle: {
      marginLeft: 0,
    },
    rightIconContainerStyle: {},
  });

const HintText = styled.Text`
  margin: 4px;
  position: absolute;
  left: 16;
  font-size: 12px;
  ${({ top = 60 }) => `top: ${top};`}
  ${({ hintTextLeft }) => {
    if (hintTextLeft !== undefined) return `left: ${hintTextLeft}`;
  }}
  ${({ theme, focused }) => {
    if (focused) return `color: ${theme.inputField.inputFocus}`;
    return `color: ${theme.colors.gray[1]}`;
  }}
  ${({ customHintStyles }) => {
    if (customHintStyles) return customHintStyles;
  }}
`;

const TextArea = React.forwardRef((props, ref) => {
  const {
    value,
    error,
    onBlur,
    onFocus,
    label,
    height = 200,
    theme,
    hint,
    touched,
    returnKeyType,
    labelComponent,
    hintTextLeft,
    customStyles = {},
    placeholderTextColor = '#3c3c434c',
    numberOfLines=3
  } = props;
  const styles = getStyles(theme);

  const inputRef = useRef(ref);

  const [focused, setFocused] = useState(false);

  const errorMessage = touched && error;

  const labelStyle = () => {
    const hasValue = !!value;
    const customLabelStyles = customStyles.customLabelStyles;
    const customFocusedLabelStyles = customStyles.customLabelStyles;
    const layoutStyle = focused || hasValue ? styles.labelTop : styles.label;
    const highlightStyle = () => {
      if (errorMessage) {
        return hasValue || focused ? styles.errorLabel : {};
      }

      return focused ? customFocusedLabelStyles || styles.blue : {};
    };
    return { ...layoutStyle, ...customLabelStyles, ...highlightStyle() };
  };

  const labelCom = labelComponent || (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.labelOpacity}
      onPress={() => {
        inputRef.current.focus();
      }}
    >
      <View style={styles.labelView}>
        <Text style={labelStyle()}>{label}</Text>
      </View>
    </TouchableOpacity>
  );

  const valueAsString =
    typeof value !== 'undefined' && value !== null ? value.toString() : value;

  const inputContainerStyle = [
    styles.inputContainerStyle,
    customStyles.inputContainerStyle,
  ];
  const inputContainerFocused = [
    styles.inputContainerFocused,
    customStyles.inputContainerFocused,
  ];
  const errorStyle = [styles.error, customStyles.error];

  return (
    <Box height={height}>
      <ReactElementsInput
        {...props}
        {...(Platform.OS === 'android'
          ? { selectionColor: theme.colors.blue[1] }
          : {})}
        inputContainerStyle={[
          inputContainerStyle,
          focused && inputContainerFocused,
          errorMessage && errorStyle,
          { height },
        ]}
        multiline
        returnKeyType={returnKeyType || 'default'}
        containerStyle={[styles.containerStyle, { height }]}
        inputStyle={[styles.inputStyle, customStyles.inputStyle, { height }]}
        label={label && labelCom}
        errorMessage={errorMessage || ''}
        errorStyle={[styles.errorMessage, customStyles.errorMessage]}
        onBlur={e => {
          if (onBlur) onBlur(e);
          setFocused(false);
        }}
        ref={setRefs(inputRef, ref)}
        onFocus={e => {
          if (onFocus) onFocus(e);
          setFocused(true);
        }}
        placeholderTextColor={placeholderTextColor} // default placeholder color, force for darktheme as well
        value={valueAsString}
        numberOfLines={3}
      />
      {!errorMessage && (
        <HintText
          top={height}
          focused={focused}
          hintTextLeft={hintTextLeft}
          customHintStyles={customStyles.customHintStyles}
        >
          {hint}
        </HintText>
      )}
    </Box>
  );
});

TextArea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hint: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  theme: PropTypes.shape({}),
  touched: PropTypes.bool,
  returnKeyType: PropTypes.string,
  editable: PropTypes.bool,
  onTouchStart: PropTypes.func,
  customStyles: PropTypes.shape({
    customLabelStyles: PropTypes.object,
    customFocusedLabelStyles: PropTypes.object,
    customHintStyles: PropTypes.object,
    inputContainerStyle: PropTypes.object,
    inputContainerFocused: PropTypes.object,
    error: PropTypes.object,
    inputStyle: PropTypes.object,
    errorMessage: PropTypes.object,
    rightIconContainerStyle: PropTypes.object,
  }),
};

export default withTheme(TextArea);
