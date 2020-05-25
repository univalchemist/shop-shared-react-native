import React from 'react';
import { Box } from '@wrappers/components';
import { CardLoader } from '@screens/Health/components/widgets/CardLoader';

export const GeneralTipsLoader = ({
  cardWidthWithSpacing,
  cardHeight,
  horizontalMarginBetweenCards,
  loaderWidthInsideCard,
}) => {
  return (
    <Box
      width={cardWidthWithSpacing}
      height={cardHeight}
      px={horizontalMarginBetweenCards / 3}
      marginTop={16}
      alignSelf="center"
    >
      <CardLoader width={loaderWidthInsideCard} />
    </Box>
  );
};
