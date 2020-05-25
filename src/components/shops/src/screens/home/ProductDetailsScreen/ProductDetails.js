import React from 'react';
import { Box, Text } from '@shops/wrappers/components';
import { useTheme } from '@shops/wrappers/core/hooks';
import { ProductHeader } from '@shops/components';
import ImageSlider from './ImageSlider';

const ProductDetails = ({ product }) => {
  const theme = useTheme();

  return (
    <Box
      bg={'transparent'}
      borderBottomWidth={1}
      borderColor={theme.colors.divider}
      py={2}
    >
      <ProductHeader product={product} />
      <ImageSlider images={product.images} />
      <Box py={16}>
        <Text>{product.shortDescription}</Text>
      </Box>
    </Box>
  );
};

export default ProductDetails;
