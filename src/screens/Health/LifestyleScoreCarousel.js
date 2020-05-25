import React, { useState } from 'react';
import { Pagination } from 'react-native-snap-carousel';
import { Dimensions } from 'react-native';
import theme from '@theme';
import { Box, TrackedCarousel } from '@wrappers/components';
import { HealthScore, HealthScoreHistory } from '@screens/Health/components';
import { categories } from '@store/analytics/trackingActions';

const LifestyleScoreCarousel = () => {
  const horizontalMarginBetweenCards = theme.space[3];
  const viewportWidth = Dimensions.get('window').width;
  const viewportPadding = theme.space[4];
  const cardWidth = viewportWidth - viewportPadding * 2;
  const cardWidthWithSpacing = cardWidth + horizontalMarginBetweenCards;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <TrackedCarousel
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        data={[{}, {}]}
        sliderWidth={viewportWidth}
        itemWidth={cardWidthWithSpacing}
        onSnapToItem={index => setActiveIndex(index)}
        actionParams={{
          category: categories.LIFESTYLE_OVERVIEW,
          action: 'Horizontal scroll of health score',
        }}
        renderItem={({ index }) => (
          <Box
            width={cardWidthWithSpacing}
            marginBottom={1}
            px={horizontalMarginBetweenCards / 3}
            flexGrow={1}
            minHeight={336}
          >
            {index === 0 ? <HealthScore /> : <HealthScoreHistory />}
          </Box>
        )}
      />
      <Pagination
        containerStyle={{
          paddingVertical: 15,
          paddingBottom: 24,
        }}
        inactiveDotScale={1}
        dotsLength={2}
        activeDotIndex={activeIndex}
      />
    </>
  );
};

export default LifestyleScoreCarousel;
