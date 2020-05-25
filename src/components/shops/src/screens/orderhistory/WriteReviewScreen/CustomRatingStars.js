import React from 'react';
import { Box, Icon } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { TouchableOpacity } from 'react-native';

const CustomRatingStars = ({
  options = {},
  enable = false,
  fontSizeStars = 25,
  onPress = () => {},
  starContainerStyle = {},
  currentRating,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Box flexDirection={'row'} {...props} alignItems={'center'}>
      {Object.keys(options).map((key, index) => {
        const starId = options[key];
        return (
          <TouchableOpacity
            key={key}
            disabled={!enable}
            style={starContainerStyle}
            onPress={() => onPress(starId)}
          >
            <Icon
              name={
                currentRating && starId <= currentRating
                  ? 'star'
                  : 'star-border'
              }
              size={fontSizeStars}
              color={theme.colors.ratings}
            />
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.currentRating === nextProps.currentRating &&
    prevProps.enable === nextProps.enable
  );
};

export default React.memo(CustomRatingStars, areEqual);
