import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { Image } from '@heal/src/wrappers/components';
import { navBackArrow } from '@heal/images';

export const StackBackButton = ({ style, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        ...Platform.select({
          ios: { paddingLeft: 16 },
          android: {},
        }),
        ...style,
        paddingRight: 16,
      }}
      onPress={onPress}
    >
      <Image source={navBackArrow} width={12} height={22} />
    </TouchableOpacity>
  );
};

export const healNavigationOptions = {
  headerBackImage: StackBackButton,
};
