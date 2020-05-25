/* istanbul ignore file */

import { useTheme as useThemeDefault, useIntl } from '@cxa-rn/core';
import { useSelector } from 'react-redux';
import { getSymbolCurrencySelector } from '@shops/store/selectors';

export { useIntl };

export const useTheme = () => {
  return useThemeDefault().shop;
};

const formatMoney = price =>
  parseFloat(price)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');

export const useGetFormattedPrice = (price, defaultSymbol) => {
  const currencySymbol =
    defaultSymbol || useSelector(getSymbolCurrencySelector);
  if (!price) return '';
  return currencySymbol + ' ' + formatMoney(price);
};
