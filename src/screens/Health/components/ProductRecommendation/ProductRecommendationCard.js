import React, { useState } from 'react';
import { TouchableHighlight } from 'react-native';
import {
  Box,
  Text,
  SectionHeadingText,
  PlainText,
  Image,
  Card,
  ImageErrorCard,
} from '@wrappers/components';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import styled from 'styled-components/native';
import { SHOP } from '@routes';
import { categories, logAction } from '@store/analytics/trackingActions';
import { mapCurrencyCodeToSymbol } from '@utils/currency';
import uuid from 'uuid';

const StyledImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1.7;
  resize-mode: contain;
`;

const StyledTouchableHighlight = styled(TouchableHighlight)`
  border-radius: 4px;
`;

const BeforeDiscountPriceText = styled(PlainText)`
  text-decoration-line: line-through;
  text-decoration-style: solid;
  ${({ theme }) => `
    color: ${theme.colors.gray[8]}
  `};
`;

const ProductRecommendationCard = ({
  product,
  productPosition,
  tipCategory,
  navigation,
}) => {
  const theme = useTheme();
  const intl = useIntl();

  const horizontalMarginBetweenCards = theme.space[3];

  const [isError, setError] = useState(false);

  const fmtRegPrice =
    mapCurrencyCodeToSymbol(product.currency) +
    ' ' +
    product.price?.toLocaleString(intl.locale, {
      minimumFractionDigits: 2,
    });
  const fmtSpecialPrice =
    mapCurrencyCodeToSymbol(product.currency) +
    ' ' +
    product.specialPrice?.toLocaleString(intl.locale, {
      minimumFractionDigits: 2,
    });

  const type = tipCategory ? 'lr' : 'lo';
  const queryPrefix = product.url.indexOf('?') !== -1 ? '&' : '?';
  const urlWithTrack = `${product.url}${queryPrefix}rec=suggestedoffers&type=${type}&pos=${productPosition}`;

  return (
    <Box px={horizontalMarginBetweenCards / 3} flexGrow={1}>
      <StyledTouchableHighlight
        accessible={true}
        accessibilityRole="button"
        underlayColor={theme.colors.touchableOverlayColor}
        onPress={() => {
          logAction({
            category: categories.LIFESTYLE_OVERVIEW,
            action: `Click on product recommended ${productPosition}`,
            product_name: product.name,
          });
          navigation.navigate(SHOP, { url: urlWithTrack + '/?uuid=' + uuid() });
        }}
      >
        <Card bg="white" flexGrow={1}>
          {product.imageUrl && !isError ? (
            <StyledImage
              source={{ uri: product.imageUrl }}
              onError={() => setError(true)}
              accessibilityLabel={product.name}
              accessible={true}
            />
          ) : (
            <ImageErrorCard
              width={'100%'}
              aspectRatio={1.7}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              accessibilityLabel={intl.formatMessage({
                id: 'image.error.unableToLoad',
              })}
              accessible={true}
            />
          )}

          <Box mt={4} mx={24} height={64}>
            <SectionHeadingText
              accessibilityLabel={product.name}
              accessible={true}
              numberOfLines={2}
            >
              {product.name}
            </SectionHeadingText>
            <Text accessible={true} accessibilityLabel={product.provider}>
              {product.provider}
            </Text>
          </Box>
          <Box mt={24} mx={24} mb={32}>
            {product.specialPrice ? (
              <Box>
                <BeforeDiscountPriceText
                  accessible={true}
                  accessibilityLabel={fmtRegPrice}
                >
                  {fmtRegPrice}
                </BeforeDiscountPriceText>
                <SectionHeadingText
                  accessible={true}
                  accessibilityLabel={fmtSpecialPrice}
                >
                  {fmtSpecialPrice}
                </SectionHeadingText>
              </Box>
            ) : (
              <Box pt={22}>
                <SectionHeadingText
                  accessible={true}
                  accessibilityLabel={fmtRegPrice}
                >
                  {fmtRegPrice}
                </SectionHeadingText>
              </Box>
            )}
          </Box>
        </Card>
      </StyledTouchableHighlight>
    </Box>
  );
};

export default ProductRecommendationCard;
