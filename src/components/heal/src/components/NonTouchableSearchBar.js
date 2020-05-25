import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, PlainText } from '@heal/src/wrappers/components';
import { Icon } from 'react-native-elements';
import { useTheme } from '@wrappers/core/hooks';

const NonTouchableSearchBar = ({ placeholder = 'Search doctor', onPress, ...props }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.7} onPress={onPress}>
      <Box
        px={10}
        flexDirection={'row'}
        height={44}
        alignItems={'center'}
        borderRadius={10}
        backgroundColor={theme.heal.colors.gray[1]}
        {...props}
      >
        <Icon size={32} name={'search'} type={'evilicon'} />
        <PlainText ml={8} color={theme.heal.colors.gray[4]}>
          {placeholder}
        </PlainText>
      </Box>
    </TouchableOpacity>
  );
};

export default NonTouchableSearchBar;
