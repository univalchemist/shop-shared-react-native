import React from 'react';
import ClaimListScreen from './ClaimsListScreen';
import { Box, Text } from '@wrappers/components';
import { FormattedMessage } from 'react-intl';
import { useIntl, useTheme } from '@wrappers/core/hooks';

export const ContainerText = ({ children, top }) => {
  const extrasProps = top ? { marginTop: 24, marginBottom: 16 } : {};
  return (
    <Box mx={32} {...extrasProps}>
      {children}
    </Box>
  );
};

const DependentText = ({ top, ...props }) => {
  const theme = useTheme();
  const intl = useIntl();
  return (
    <ContainerText top>
      <Box>
        <Text textAlign="center" letterSpacing={0.3} {...props}>
          <FormattedMessage id="claim.noClaimsTextDependent" />
        </Text>
      </Box>
    </ContainerText>
  );
};

const ClaimsListScreenDependent = () => {
  return <ClaimListScreen noFab dependentText={DependentText} />;
};

export default ClaimsListScreenDependent;
