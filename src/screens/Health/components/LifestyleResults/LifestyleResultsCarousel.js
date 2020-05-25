import { Pagination } from 'react-native-snap-carousel';
import { TrackedCarousel, Box } from '@wrappers/components';
import LifestyleResultsCard from './LifestyleResultsCard';
import React, { useState } from 'react';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';
import { useTheme } from '@wrappers/core/hooks';
import { categories } from '@store/analytics/trackingActions';

export const LifestyleResultsCarousel = ({
  data,
  cardWidthWithSpacing,
  horizontalMarginBetweenCards,
  viewportWidth,
  navigation,
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box marginTop={16}>
      <TrackedCarousel
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        data={data}
        onSnapToItem={index => setActiveIndex(index)}
        actionParams={{
          category: categories.LIFESTYLE_OVERVIEW,
          action: 'Horizontal scroll of my results',
        }}
        renderItem={({ item }) => (
          <Box
            width={cardWidthWithSpacing}
            flexGrow={1}
            marginBottom={1}
            px={horizontalMarginBetweenCards / 3}
          >
            {item.isValid ? (
              <LifestyleResultsCard {...item} navigation={navigation} />
            ) : (
              <ErrorCard color={theme.colors.error[3]} />
            )}
          </Box>
        )}
        sliderWidth={viewportWidth}
        itemWidth={cardWidthWithSpacing}
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
