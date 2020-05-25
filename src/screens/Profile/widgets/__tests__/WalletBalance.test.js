import { renderForTest } from '@testUtils';
import React from 'react';
import WalletBalance from '../WalletBalance';

describe('WalletBalance', () => {
  it('renders correctly', () => {
    const props = {
      availableBalance: 1000,
      maximumBalance: 5000,
      expirationDate: '2019-03-23T00:00:00',
    };
    const { getByText } = renderForTest(<WalletBalance {...props} />);

    const walletBalanceTitle = getByText('WALLET BALANCE (HK$)');
    const availableBalanceText = getByText('1,000.00');
    const maximumBalanceText = getByText(' of 5,000.00');
    const dateText = getByText('Expires on 23 Mar 2019');
    expect(walletBalanceTitle).toBeDefined();
    expect(availableBalanceText).toBeDefined();
    expect(maximumBalanceText).toBeDefined();
    expect(dateText).toBeDefined();
  });
});
