import React from 'react';
import { Box, Flex, TextSkeletonPlaceholder } from '@wrappers/components';
import { useTheme } from '@wrappers/core/hooks';
import { CardContainer } from '@screens/Health/components/widgets/CardContainer';

export const LifestyleResultsLoader = ({
  cardWidthWithSpacing,
  cardHeight,
  horizontalMarginBetweenCards,
}) => {
  const theme = useTheme();
  return (
    <Box
      width={cardWidthWithSpacing}
      height={cardHeight}
      px={horizontalMarginBetweenCards / 3}
      marginTop={16}
      alignSelf="center"
    >
      <CardContainer theme={theme} color={'#D7D8D6'}>
        <Flex flexDirection={'row'} alignItems="center">
          <TextSkeletonPlaceholder fontSize={43} lineHeight={43} width={60} />
          <Flex flexDirection={'column'} paddingLeft={26}>
            <TextSkeletonPlaceholder
              fontSize={16}
              lineHeight={25}
              width={cardWidthWithSpacing - 150}
            />
            <TextSkeletonPlaceholder
              fontSize={24}
              lineHeight={22}
              width={cardWidthWithSpacing - 150}
            />
          </Flex>
        </Flex>
        <Box paddingTop={36}>
          <TextSkeletonPlaceholder
            fontSize={16}
            lineHeight={25}
            width={cardWidthWithSpacing - 64}
          />
          <TextSkeletonPlaceholder
            fontSize={16}
            lineHeight={25}
            width={cardWidthWithSpacing - 64}
          />
          <TextSkeletonPlaceholder
            fontSize={16}
            lineHeight={25}
            width={cardWidthWithSpacing - 64}
          />
          <TextSkeletonPlaceholder
            fontSize={16}
            lineHeight={25}
            width={cardWidthWithSpacing - 64}
          />
        </Box>
      </CardContainer>
    </Box>
  );
};
