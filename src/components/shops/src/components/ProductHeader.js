import React from 'react';
import {
  Text,
  PlainText,
  Box,
  SecondaryText,
} from '@shops/wrappers/components';
import { useGetFormattedPrice, useIntl, useTheme } from '@shops/wrappers/core/hooks';
import styled from 'styled-components/native';


export const BeforeDiscountPriceText = styled(PlainText)`
  text-decoration-line: line-through;
  text-decoration-style: solid;
`;

const ProductHeader = ({ product }) => {
  const intl = useIntl();
  const theme = useTheme();
  const fmtRegPrice = useGetFormattedPrice(product.price);
  const fmtSpecialPrice = useGetFormattedPrice(product.finalPrice);

  return (
    <>
      {/* Name */}
      <Text
        accessibilityLabel={product.name}
        accessible={true}
        numberOfLines={2}
        fontSize={18}
        fontWeight={600}
      >
        {product.name}
      </Text>
      <Text accessible={true} accessibilityLabel={product.vendor} fontSize={12}>
        {product.vendor}
      </Text>
      {/* Price */}
      <Box mt={20} mb={10}>
        {product.discountPercent ? (
          <Box>
            <Box flexDirection={'row'} alignItems={'center'}>
              <BeforeDiscountPriceText
                accessible={true}
                accessibilityLabel={fmtRegPrice}
                fontSize={14}
                color={theme.colors.label}
              >
                {fmtRegPrice}
              </BeforeDiscountPriceText>
              <SecondaryText
                fontSize={14}
                fontWeight={600}
                ml={1}
                color={theme.colors.label}
              >
                {`${product.discountPercent}% ${intl.formatMessage({
                  id: 'shop.common.off',
                })}`}
              </SecondaryText>
            </Box>
            <Text
              accessible={true}
              accessibilityLabel={fmtSpecialPrice}
              fontWeight={600}
            >
              {fmtSpecialPrice}
            </Text>
          </Box>
        ) : (
          <Box>
            <Text
              accessible={true}
              accessibilityLabel={fmtRegPrice}
              fontWeight={600}
            >
              {fmtRegPrice}
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};


export default ProductHeader;
