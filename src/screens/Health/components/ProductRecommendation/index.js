import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import ProductRecommendationLoader from './ProductRecommendationLoader';
import ProductRecommendationError from './ProductRecommendationError';
import ProductRecommendationCard from './ProductRecommendationCard';
import { Box, SectionHeadingText, TrackedCarousel } from '@wrappers/components';
import { useFetchActions, useTheme, useIntl } from '@wrappers/core/hooks';
import { Pagination } from 'react-native-snap-carousel';
import { categories } from '@store/analytics/trackingActions';

export const ProductRecommendation = ({
  productRecommendations,
  fetchProductRecommendations,
  title,
  tipCategory,
  navigation,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  const [isLoading, isError] = useFetchActions(
    [fetchProductRecommendations],
    true,
    [intl],
    [{ tipCategory }],
  );
  const viewportWidth = Dimensions.get('window').width;
  const horizontalMarginBetweenCards = theme.space[3];
  const viewportPadding = theme.space[4];
  const cardWidth = viewportWidth - viewportPadding * 2;
  const cardWidthWithSpacing = cardWidth + horizontalMarginBetweenCards;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {isLoading ? (
        <Box mx={32} mb={104} mt={16}>
          <ProductRecommendationLoader />
        </Box>
      ) : isError ? (
        <Box mx={32} mb={104} mt={16}>
          <ProductRecommendationError title={title} />
        </Box>
      ) : (
        productRecommendations &&
        productRecommendations.length > 0 && (
          <Box mb={72}>
            <Box mx={4} mb={16}>
              <SectionHeadingText accessible={true} accessibilityLabel={title}>
                {title}
              </SectionHeadingText>
            </Box>
            <TrackedCarousel
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              data={productRecommendations}
              sliderWidth={viewportWidth}
              itemWidth={cardWidthWithSpacing}
              onSnapToItem={index => setActiveIndex(index)}
              renderItem={({ item, index }) => (
                <ProductRecommendationCard
                  product={item}
                  productPosition={index + 1}
                  tipCategory={tipCategory}
                  navigation={navigation}
                />
              )}
              actionParams={{
                category: categories.LIFESTYLE_OVERVIEW,
                action: 'Horizontal scroll of product recomm',
              }}
            />
            <Pagination
              containerStyle={{
                paddingVertical: 15,
                paddingBottom: 24,
              }}
              inactiveDotScale={1}
              dotsLength={productRecommendations.length}
              activeDotIndex={activeIndex}
            />
          </Box>
        )
      )}
    </>
  );
};

export default ProductRecommendation;
