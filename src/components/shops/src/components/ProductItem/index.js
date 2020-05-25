import React from 'react';
import { TouchableHighlight, Dimensions } from 'react-native';
import {
  Box,
  Text,
  SectionHeadingText,
  SecondaryText,
  Card,
} from '@shops/wrappers/components';
import { ImageProduct, Price, RatingStars } from '@shops/components';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';
import styled from 'styled-components/native';

const { width: w } = Dimensions.get('window');
const cardWidth = (w - 28 * 3) / 2;

const StyledTouchableHighlight = styled(TouchableHighlight)`
  border-radius: 4px;
`;

const ProductItem = ({ product, onPress }) => {
  const theme = useTheme();
  const intl = useIntl();
  return (
    <Box width={cardWidth}>
      <StyledTouchableHighlight
        accessible={true}
        onPress={() => onPress(product)}
        accessibilityRole="button"
        underlayColor={theme.colors.touchableOverlayColor}
      >
        <Card bg="white" flexGrow={1}>
          {!!product.discountPercent && (
            <Box
              width={36}
              height={36}
              borderRadius={18}
              bg={theme.colors.primary[0]}
              position="absolute"
              top={12}
              right={12}
              zIndex={2}
              justifyContent="center"
              alignItem="center"
            >
              <Text
                textAlign="center"
                color={theme.colors.white}
                fontWeight="bold"
                fontSize={12}
                lineHeight={16}
              >
                {`${product.discountPercent}%`}
              </Text>
              <Text
                textAlign="center"
                fontSize={12}
                lineHeight={14}
                color={theme.colors.white}
                marginTop={0}
              >
                {intl.formatMessage({ id: 'shop.common.off' })}
              </Text>
            </Box>
          )}
          <ImageProduct imageModel={product.thumbnail} />

          <Box mt={3} mx={20} height={60}>
            {/*{payByWallet && (*/}
            {/*<Box*/}
            {/*borderRadius={2}*/}
            {/*backgroundColor={theme.colors.red}*/}
            {/*position="absolute"*/}
            {/*top={-42}*/}
            {/*left={-8}*/}
            {/*zIndex={2}*/}
            {/*justifyContent="center"*/}
            {/*alignItem="center"*/}
            {/*px={2}*/}
            {/*>*/}
            {/*<Text*/}
            {/*textAlign="center"*/}
            {/*color={theme.colors.white}*/}
            {/*fontWeight="bold"*/}
            {/*fontSize={14}*/}
            {/*>*/}
            {/*Pay By Wallet*/}
            {/*</Text>*/}
            {/*</Box>*/}
            {/*)}*/}
            <SectionHeadingText
              accessibilityLabel={product.name}
              accessible={true}
              numberOfLines={2}
            >
              {product.name}
            </SectionHeadingText>
            <SecondaryText
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              accessible={true}
              accessibilityLabel={product.vendor}
            >
              {product.vendor}
            </SecondaryText>
          </Box>
          <Box
            mx={16}
            mt={12}
            mb={20}
            flexDirection="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <RatingStars rating={product.averageRating} />
            <Text marginLeft={1}  textAlign={'center'}>
              {product.ratingsCount}
            </Text>
          </Box>
          <Box mx={16} mb={16}>
            <Price basePrice={product.price} finalPrice={product.finalPrice} />
          </Box>
        </Card>
      </StyledTouchableHighlight>
    </Box>
  );
};

export default ProductItem;
