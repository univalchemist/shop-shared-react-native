import { Box, Image, ScreenHeadingText } from '@wrappers/components';
import React from 'react';
import { Dimensions, ScrollView, SafeAreaView } from 'react-native';
import theme from '@theme';
import {
  LifestyleResults,
  GeneralTips,
  FaceAgingResults,
  ProductRecommendation,
} from '@screens/Health/components';
import LifestyleScoreCarousel from './LifestyleScoreCarousel';
import LifestyleNavigationButtons from './LifestyleNavigationButtons';
import { mainHeroImage } from '@images';
import { FormattedMessage } from 'react-intl';
import { useIntl } from '@wrappers/core/hooks';
import { connect } from 'react-redux';
import { fetchProductRecommendations } from '@store/health/actions';

const viewportWidth = Dimensions.get('window').width;

const LifestyleResultsScreen = ({
  fetchProductRecommendations,
  productRecommendations,
  navigation,
}) => {
  const intl = useIntl();
  return (
    <Box as={SafeAreaView} backgroundColor={theme.colors.imageHeaderMatching}>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: theme.colors.backgroundColor,
        }}
      >
        <Box backgroundColor={theme.colors.backgroundColor}>
          <Box height={150}>
            <Box position="absolute" right={0} top={0} bottom={0}>
              <Image
                height={150}
                width={viewportWidth}
                source={mainHeroImage}
              />
            </Box>
            <Box position="absolute" pl={4} pr={136} top={36}>
              <ScreenHeadingText
                accessible={true}
                accessibilityLabel={intl.formatMessage({
                  id: 'health.sectionTitle.main',
                })}
                numberOfLines={2}
              >
                <FormattedMessage id="health.sectionTitle.main" />
              </ScreenHeadingText>
            </Box>
          </Box>
          <Box pt={4}>
            <LifestyleScoreCarousel />
          </Box>
          <Box px={4}>
            <LifestyleNavigationButtons navigation={navigation} />
          </Box>
          <LifestyleResults navigation={navigation} />
          <GeneralTips />
          <FaceAgingResults />
          <ProductRecommendation
            title={intl.formatMessage({
              id: 'health.productRecommendation.title',
            })}
            productRecommendations={productRecommendations}
            fetchProductRecommendations={fetchProductRecommendations}
            navigation={navigation}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

const mapStateToProps = ({ health: { productRecommendations } }) => ({
  productRecommendations,
});

export default connect(mapStateToProps, { fetchProductRecommendations })(
  LifestyleResultsScreen,
);
