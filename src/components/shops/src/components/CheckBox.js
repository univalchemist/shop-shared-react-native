import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { SecondaryText, Image, Flex } from '@shops/wrappers/components';
import { checkboxActive, checkboxInactive } from '@shops/assets/icons';

const CustomCheckBox = ({ onPress, label, checked }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Flex flexDirection="row" justifyContent="space-between">
        <SecondaryText>{label}</SecondaryText>
        <CheckBox
          containerStyle={styles.checkBoxContainer}
          checked={checked}
          onPress={onPress}
          checkedIcon={<Image source={checkboxActive} />}
          uncheckedIcon={<Image source={checkboxInactive} />}
        />
      </Flex>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  checkBoxContainer: {
    padding: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
});

export default CustomCheckBox;
