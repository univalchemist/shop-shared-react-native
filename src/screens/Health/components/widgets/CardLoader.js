import React from 'react';
import { TextSkeletonPlaceholder, Box, Divider } from '@wrappers/components';
import { TouchableContainer } from './TipCard';

export const CardLoader = ({ width }) => (
  <TouchableContainer>
    <>
      <Box style={{ paddingLeft: 24, paddingRight: 24 }}>
        <TextSkeletonPlaceholder width={width * 0.8} />
      </Box>
      <Box style={{ paddingTop: 4, paddingLeft: 24, paddingRight: 24 }}>
        <TextSkeletonPlaceholder width={width * 0.5} />
      </Box>
      <Box style={{ paddingTop: 30, paddingLeft: 24, paddingRight: 24 }}>
        <TextSkeletonPlaceholder width={width} />
      </Box>
      <Box style={{ paddingTop: 4, paddingLeft: 24, paddingRight: 24 }}>
        <TextSkeletonPlaceholder width={width} />
      </Box>
      <Box
        style={{
          paddingTop: 4,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 32,
        }}
      >
        <TextSkeletonPlaceholder width={width * 0.5} />
      </Box>
      <Divider full={true} />
      <Box
        style={{
          paddingTop: 16,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 16,
        }}
      >
        <TextSkeletonPlaceholder width={width * 0.5} />
      </Box>
    </>
  </TouchableContainer>
);
