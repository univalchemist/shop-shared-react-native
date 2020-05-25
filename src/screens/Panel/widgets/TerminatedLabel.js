import React from 'react';
import styled from 'styled-components/native';
import { Text, Box, Image } from '@wrappers/components';
import { useIntl } from '@wrappers/core/hooks';
import { warningIcon } from '@images';

const StyledLabel = styled(Text)`
  ${({ theme }) => `
  font-size: ${theme.fontSizes[0]};
  color: ${theme.colors.gray[0]};
  letter-spacing: 0.4px;
  `}
`;

const ImageBox = styled(Box)`
  margin-top: 4px;
  margin-right: 4px;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
`;

const TerminatedLabel = () => {
  const intl = useIntl();
  return (
    <Container>
      <ImageBox>
        <Image source={warningIcon} style={{ width: 14, height: 14 }} />
      </ImageBox>
      <StyledLabel>
        {intl.formatMessage({ id: 'panelSearch.terminated' })}
      </StyledLabel>
    </Container>
  );
};

export default TerminatedLabel;
