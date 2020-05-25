import React, { useState, useCallback, useEffect } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Box } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import PropTypes from 'prop-types';

const SearchInput = ({ value, placeholder, onChangeText }) => {
  const theme = useTheme();
  const [focus, setFocus] = useState(false);
  const [searchString, setSearchString] = useState(value);

  useEffect(() => setSearchString(value), [value]);

  const setFocusStatus = useCallback(() => {
    setFocus(!focus);
  }, [focus]);

  const onSubmitEditing = useCallback(() => {
    console.log('onSubmit', searchString);
    if (searchString?.length >= 3 || searchString?.length === 0) {
      onChangeText(searchString);
    }
  }, [searchString, onChangeText]);

  return (
    <Box
      width="100%"
      height={56}
      borderRadius={4}
      borderWidth={0.5}
      pl={16}
      borderColor={focus ? theme.colors.primary[1] : theme.colors.border}
      backgroundColor={focus ? theme.colors.white : theme.colors.primary[1]}
      justifyContent="center"
    >
      <TextInput
        value={searchString}
        onChangeText={value => setSearchString(value)}
        placeholder={placeholder}
        placeholderTextColor={focus ? theme.colors.text : theme.colors.white}
        style={[
          styles.input,
          { color: focus ? theme.colors.text : theme.colors.white },
        ]}
        autoCapitalize={'none'}
        onBlur={setFocusStatus}
        onFocus={setFocusStatus}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
      />
    </Box>
  );
};
const styles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
});

SearchInput.propTypes = {
  style: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  textStyle: PropTypes.object,
  onChangeText: PropTypes.func,
};

export default SearchInput;
