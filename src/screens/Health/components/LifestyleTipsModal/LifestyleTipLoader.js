import React from 'react';
import { TextSkeletonPlaceholder, Box } from '@wrappers/components';
import { LayoutContainer } from './LifestyleTipLayout';
import { Dimensions, View } from 'react-native';
import theme from '@theme';
import { CardLoader } from '@screens/Health/components/widgets/CardLoader';

const renderLoaderGroup = width => (
  <View>
    <TextSkeletonPlaceholder width={width * 0.8} />
    <Box style={{ paddingTop: 4 }}>
      <TextSkeletonPlaceholder
        lineHeight={30}
        fontSize={30}
        width={width * 0.5}
      />
    </Box>
    <Box style={{ paddingTop: 30 }}>
      <TextSkeletonPlaceholder width={width} />
    </Box>
    <Box style={{ paddingTop: 4 }}>
      <TextSkeletonPlaceholder width={width} />
    </Box>
    <Box style={{ paddingTop: 4 }}>
      <TextSkeletonPlaceholder width={width * 0.5} />
    </Box>
  </View>
);

export const LifestyleTipLoader = () => {
  const viewportWidth = Dimensions.get('window').width;
  const viewportPadding = theme.space[4];
  const viewportPaddingInsideCard = theme.space[4] + 24;
  const loaderWidth = viewportWidth - viewportPadding * 2;
  const loaderWidthInsideCard = viewportWidth - viewportPaddingInsideCard * 2;

  return (
    <LayoutContainer>
      <Box paddingTop={40} />
      {renderLoaderGroup(loaderWidth, 30)}
      <Box paddingTop={40} />
      <CardLoader width={loaderWidthInsideCard} />
      <CardLoader width={loaderWidthInsideCard} />
    </LayoutContainer>
  );
};
