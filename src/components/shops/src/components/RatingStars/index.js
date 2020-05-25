import React, { useEffect, useState } from 'react';
import { Box, Icon } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { TouchableOpacity } from 'react-native';
const NUM_OF_STARS = 5;

const RatingStars = ({
  rating: initRate,
  enable = false,
  fontSizeStars = 14,
  onPress = () => {},
  starContainerStyle = {},
  index,
  ...props
}) => {
  const theme = useTheme();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (Array.isArray(initRate)) {
      setRating(getRatingTotal(initRate));
    } else {
      setRating(initRate ? (initRate / 100) * NUM_OF_STARS : 0);
    }
  }, [initRate]);

  const getRatingTotal = rating => {
    const totalRating = rating.reduce((acc, singleRate) =>
      acc + singleRate.percent ? singleRate.percent / 100 : 0,
    );
    return totalRating * NUM_OF_STARS;
  };

  return (
    <Box flexDirection={'row'} {...props} alignItems={'center'}>
      {new Array(NUM_OF_STARS).fill().map((_, ind) => {
        return (
          <TouchableOpacity
            key={ind}
            disabled={!enable}
            style={starContainerStyle}
            onPress={() => onPress(((ind + 1) * 100) / NUM_OF_STARS, index)}
          >
            <Icon
              name={rating > ind ? 'star' : 'star-border'}
              size={fontSizeStars}
              color={theme.colors.ratings}
            />
          </TouchableOpacity>
        );
      })}
    </Box>
  );
};

export default RatingStars;
