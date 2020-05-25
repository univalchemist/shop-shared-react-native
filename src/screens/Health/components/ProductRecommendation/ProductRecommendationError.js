import React from 'react';
import { CardContainer } from '@screens/Health/components/widgets/CardContainer';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import { Box, SectionHeadingText, ErrorText } from '@wrappers/components';

const ProductRecommendationError = ({ title }) => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <>
      <Box mb={16}>
        <SectionHeadingText accessible={true} accessibilityLabel={title}>
          {title}
        </SectionHeadingText>
      </Box>
      <CardContainer
        height={368}
        justifyContent="center"
        alignItems="center"
        color={theme.colors.white}
      >
        <ErrorText
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.productRecommendation.loadingError',
          })}
          textAlign="center"
        >
          {intl.formatMessage({
            id: 'health.productRecommendation.loadingError',
          })}
        </ErrorText>
        <ErrorText
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.productRecommendation.tryAgain',
          })}
          textAlign="center"
        >
          {intl.formatMessage({
            id: 'health.productRecommendation.tryAgain',
          })}
        </ErrorText>
      </CardContainer>
    </>
  );
};

export default ProductRecommendationError;
