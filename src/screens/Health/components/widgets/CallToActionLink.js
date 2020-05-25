import React from 'react';
import { Text, Flex, Image, Divider } from '@wrappers/components';
import styled from 'styled-components/native';
import theme from '@theme';

const StyledText = styled(Text)`
  color: ${theme.colors.fonts.blackLink};
`;

const StyledImage = styled(Image)`
  width: 16px;
  height: 16px;
  align-self: center;
  margin-left: 10;
`;

export const CallToActionLink = ({ text, icon }) => {
  return (
    <Flex height={54} flexDirection="column">
      <Divider full={true} />
      <Flex
        flexDirection="row"
        paddingLeft={24}
        paddingRight={24}
        paddingTop={16}
      >
        <StyledText>{text}</StyledText>
        {icon && <StyledImage source={icon} />}
      </Flex>
    </Flex>
  );
};
