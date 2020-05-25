import React, { useState } from 'react';
import { Box } from '@shops/wrappers/components';
import { RadioGroup, RadioButton } from '@shops/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { StyleSheet } from 'react-native';

const SelectAddress = ({ addresses, initialSelected = 0, onSelectChange }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState(initialSelected);

  const onRadioGroupChange = value => {
    setSelected(value);
    onSelectChange && onSelectChange(value);
  };

  return (
    <Box>
      <RadioGroup value={selected} onChange={onRadioGroupChange}>
        {addresses.map(address => {
          return (
            <RadioButton
              text={address.text}
              value={address.id}
              textStyle={[styles.radioText, { color: theme.colors.label }]}
            />
          );
        })}
      </RadioGroup>
    </Box>
  );
};

const styles = StyleSheet.create({
  radioText: {
    marginLeft: 8,
  },
});

export default SelectAddress;
