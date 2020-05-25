import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'ramda';
import {
  TextSkeletonPlaceholder,
  Flex,
  Box,
  FormattedMoney,
  Text,
  SecondaryText,
} from '@wrappers/components';
import { FormattedMessage } from 'react-intl';

const Panel = props => (
  <Flex
    justifyContent="space-between"
    flexDirection="row"
    px={4}
    py={3}
    borderBottomWidth={1}
    borderColor="gray.5"
    bg="white"
    {...props}
  />
);

const Label = props => (
  <SecondaryText fontSize={14} lineHeight={16} fontWeight="bold" {...props} />
);

const WalletBalancePanelLayout = ({ text, balance, ...props }) => (
  <Panel>
    <Box>
      <Flex flexDirection="row">
        <Label>{text ? text : <FormattedMessage id="wallet" />}</Label>
      </Flex>
    </Box>
    <Box>{balance}</Box>
  </Panel>
);

const WalletBalancePanel = ({ balance, text }) => (
  <WalletBalancePanelLayout
    text={text}
    balance={
      <Text fontSize={14} lineHeight={16} fontWeight="bold">
        {!isNil(balance) && <FormattedMoney value={balance} />}
      </Text>
    }
  />
);

WalletBalancePanel.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const WalletBalanceSkeletonPlaceholder = () => (
  <WalletBalancePanelLayout
    text={<FormattedMessage id="wallet" />}
    balance={
      <TextSkeletonPlaceholder fontSize={14} lineHeight={16} width={128} />
    }
  />
);

const WalletBalancePanelError = () => (
  <Panel>
    <Label>
      <FormattedMessage id="wallet.error" />
    </Label>
  </Panel>
);

export { WalletBalancePanelError, WalletBalanceSkeletonPlaceholder };
export default WalletBalancePanel;
