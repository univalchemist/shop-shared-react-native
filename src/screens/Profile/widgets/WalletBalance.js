import React from 'react';
import { Box, Text, Flex, ProgressBar } from '@wrappers/components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/native';
import moment from 'moment';

const RelativeText = styled(Text)`
  ${({ balance }) => `
    font-size: ${balance.toString().length >= 7 ? '18px' : '24px'};
    margin-top: 4;
    padding-top: 4
    height: 32;
    lineHeight=24;
    letterSpacing=0.25;
  `}
`;

const WalletBalance = ({
  availableBalance,
  maximumBalance,
  expirationDate,
}) => {
  const availableBalanceFormatted = availableBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  });
  const maximumBalanceFormatted = maximumBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  });

  const expirationDateFormatted = moment(expirationDate, 'YYYY-MM-DD').format(
    'DD MMM YYYY',
  );
  return (
    <Box
      p="16px 26px"
      bg="white"
      boxShadow="0px 2px 6px rgba(0, 0, 0, 0.05)"
      borderRadius={4}
      maxHeight={128}
      minHeight={128}
    >
      <Text
        fontStyle="normal"
        letterSpacing={1.6}
        fontSize={12}
        fontWeight={600}
        color="gray.2"
      >
        <FormattedMessage id="walletBalanceTitle" />
      </Text>
      <Flex
        height={32}
        alignItems="center"
        flexDirection="row"
        marginBottom={2}
      >
        <RelativeText balance={maximumBalance}>
          <Text fontWeight={600} color="blue.0" marginTop={2}>
            {availableBalanceFormatted}
          </Text>
        </RelativeText>
        <RelativeText balance={maximumBalance}>
          <Text fontStyle="normal" color="gray.4" marginTop={2}>
            {` of ${maximumBalanceFormatted}`}
          </Text>
        </RelativeText>
      </Flex>
      <ProgressBar progress={availableBalance / maximumBalance} mt={2} />
      <Text
        top="30.48%"
        fontSize={12}
        lineHeight={16}
        color="gray.4"
        mt={2}
        paddingTop={1}
      >
        <FormattedMessage
          id="expiresOn"
          values={{ date: expirationDateFormatted }}
        />
      </Text>
    </Box>
  );
};

WalletBalance.propTypes = {
  availableBalance: PropTypes.number,
  maximumBalance: PropTypes.number,
  expirationDate: PropTypes.string,
};

export default WalletBalance;
