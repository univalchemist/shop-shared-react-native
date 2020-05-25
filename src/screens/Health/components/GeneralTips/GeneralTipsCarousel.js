import React, { useState } from 'react';
import { Pagination } from 'react-native-snap-carousel';
import { Box, TrackedCarousel } from '@wrappers/components';
import { TipCard } from '@screens/Health/components/widgets/TipCard';
import { categories } from '@store/analytics/trackingActions';

export const GeneralTipsCarousel = ({
  data,
  cardWidthWithSpacing,
  horizontalMarginBetweenCards,
  viewportWidth,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Box marginTop={16}>
      <TrackedCarousel
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        data={data}
        renderItem={({ item }) => (
          <Box
            width={cardWidthWithSpacing}
            flexGrow={1}
            px={horizontalMarginBetweenCards / 3}
          >
            <TipCard {...item} />
          </Box>
        )}
        sliderWidth={viewportWidth}
        itemWidth={cardWidthWithSpacing}
        onSnapToItem={index => setActiveIndex(index)}
        actionParams={{
          category: categories.LIFESTYLE_OVERVIEW,
          action: 'Horizontal scroll of more lifestyle tips',
        }}
      />
      <Pagination
        containerStyle={{
          paddingVertical: 15,
          paddingBottom: 24,
        }}
        inactiveDotScale={1}
        dotsLength={data.length}
        activeDotIndex={activeIndex}
      />
    </Box>
  );
};
