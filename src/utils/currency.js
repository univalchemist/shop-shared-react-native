/* istanbul ignore file */
export const mapCurrencyCodeToSymbol = currency =>
  currencyToSymbol[currency] || currency;
const currencyToSymbol = {
  SGD: 'S$',
  AUD: 'AU$',
  BDT: 'Tk',
  BND: 'BN$',
  CAD: 'C$',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  HKD: 'HK$',
  IDR: 'Rp',
  INR: '₹',
  JPY: '¥',
  KRW: '₩',
  MMK: 'K',
  MYR: 'RM',
  PHP: '₱',
  THB: '฿',
  USD: '$',
  VND: '₫',
};

export function getCurrencySymbol(locale, currency) {
  if (!currency || !locale) return '';

  return (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
}
