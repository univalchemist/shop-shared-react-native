import React from 'react';
import {
  ImageSkeletonPlaceholder,
  TextSkeletonPlaceholder,
  Card,
  Box,
} from '@wrappers/components';

const ProductRecommendationLoader = () => {
  return (
    <Card bg="white">
      <ImageSkeletonPlaceholder height={186} width={311} />

      <Box px={24} pb={32}>
        <Box mt={4}>
          <TextSkeletonPlaceholder width={263} />
        </Box>
        <Box mt={1}>
          <TextSkeletonPlaceholder width={160} />
        </Box>
        <Box mt={48}>
          <TextSkeletonPlaceholder width={160} />
        </Box>
      </Box>
    </Card>
  );
};

export default ProductRecommendationLoader;
