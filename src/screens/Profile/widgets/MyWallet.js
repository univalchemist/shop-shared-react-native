import React from 'react';
import { Box, Text, ProgressBar } from '@wrappers/components';
import { useIntl, useTheme } from '@wrappers/core/hooks';
import moment from 'moment/min/moment-with-locales';
import PropTypes from 'prop-types';
import {
  mapCurrencyCodeToSymbol,
  getCurrencySymbol,
  symbolToCurrencyCode,
} from '@utils/currency';

const MyWallet = ({
  data,
  title = 'My wallet',
  adjustsFontSizeToFit = false,
  availableBalanceTextStyle = {},
  maximumBalanceTextStyle = {},
  progressBarColor = '#0275d8',
  availableBalanceTextColor = '#0275d8',
  minimumFractionDigits = 0,
  locales = 'id-ID',
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const availableBalanceFormatted = data?.balance?.toLocaleString(locales, {
    minimumFractionDigits,
  });
  const maximumBalanceFormatted = data?.openBalance?.toLocaleString(locales, {
    minimumFractionDigits,
  });

  const expirationDateFormatted = moment(
    data?.expirationDate || '2020-04-30T00:00:00',
    'YYYY-MM-DD',
  ).format('DD MMM YYYY');

  const isAutoScale = () => {
    const availableBalanceLength = data?.balance
      ? data?.balance.toString().length
      : 0;
    const maximumBalanceLength = data?.openBalance
      ? data?.openBalance.toString().length
      : 0;
    return availableBalanceLength + maximumBalanceLength > 9;
  };

  return (
    <Box
      backgroundColor={'#fff'}
      p="16px 26px"
      width={'85%'}
      borderRadius={5}
      boxShadow="0px 2px 6px rgba(0, 0, 0, 0.05)"
      alignSelf={'center'}
      mt={-25}
      mb={10}
    >
      <Text color={theme.colors.black} fontWeight="bold">
        {title}
      </Text>

      <Text fontSize={12} mt={1} mb={2}>
        {intl.formatMessage(
          {
            id: 'profile.myWallet.currency',
            defaultMessage: `Currency (${mapCurrencyCodeToSymbol(
              data?.currency,
            )})`,
          },
          {
            currency: mapCurrencyCodeToSymbol(data?.currency),
          },
        )}
      </Text>

      <Text
        adjustsFontSizeToFit={adjustsFontSizeToFit && isAutoScale()}
        fontSize={20}
        color={availableBalanceTextColor}
        numberOfLines={1}
        fontWeight="bold"
        minimumFontScale={0.01}
        testID={'availableBalanceFormatted'}
        {...availableBalanceTextStyle}
      >
        {availableBalanceFormatted}
        <Text
          fontSize={20}
          color="gray.3"
          fontWeight="light"
          {...maximumBalanceTextStyle}
        >
          {' '}
          {intl.formatMessage({
            id: 'profile.myWallet.of',
            defaultMessage: 'of',
          })}{' '}
          {maximumBalanceFormatted}
        </Text>
      </Text>
      <ProgressBar
        progress={data?.openBalance ? data?.balance / data?.openBalance : 0}
        activeColor={progressBarColor}
        my={2}
      />
      <Text fontSize={12} color="gray.3">
        {intl.formatMessage(
          {
            id: 'profile.myWallet.expiredTime',
            defaultMessage: 'Expire on ' + expirationDateFormatted,
          },
          {
            expirationDateFormatted,
          },
        )}
      </Text>
    </Box>
  );
};

MyWallet.propTypes = {
  data: PropTypes.shape({
    balance: PropTypes.number,
    openBalance: PropTypes.number,
    expirationDate: PropTypes.string,
    currency: PropTypes.string,
  }),
  title: PropTypes.string,
  currency: PropTypes.string,
  adjustsFontSizeToFit: PropTypes.bool,
  availableBalanceTextStyle: PropTypes.object,
  maximumBalanceTextStyle: PropTypes.object,
  progressBarColor: PropTypes.string,
  availableBalanceTextColor: PropTypes.string,
  minimumFractionDigits: PropTypes.number,
  locales: PropTypes.string,
};
export default MyWallet;
