import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@shops/wrappers/components';

const ClearAllButton = ({ onPress, text, navigation }) => {
  const overridedOnPress = () => {
    onPress && onPress();
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={overridedOnPress}>
      <Text mr={16}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ClearAllButton;
