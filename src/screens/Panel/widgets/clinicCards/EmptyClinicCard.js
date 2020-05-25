import React from 'react';
import { CardContainer } from './CardContainer';
import { useTheme } from '@wrappers/core/hooks';
import { Flex, Text } from '@wrappers/components';

export const EmptyClinicCard = ({ title, description }) => {
  const theme = useTheme();
  return (
    <CardContainer>
      <Flex
        flexDirection="row"
        alignContent="center"
        justifyContent="center"
        height="100%"
        px={32}
      >
        <Text
          fontSize={theme.fontSizes[2]}
          fontWeight={`${theme.fontWeights.bold}`}
          color={`${theme.fontWeights.bold}`}
        >
          {title}
        </Text>
        <Text
          textAlign="center"
          fontSize={theme.fontSizes[2]}
          color={theme.colors.gray[8]}
        >
          {description}
        </Text>
      </Flex>
    </CardContainer>
  );
};

export default EmptyClinicCard;
