import React from 'react';
import { renderForTest } from '@testUtils';
import MyWallet from '../MyWallet';
import { ProgressBar } from '@wrappers/components';

const mockData = {
  balance: 4000,
  openBalance: 8000,
  expirationDate: '2019-03-23T00:00:00',
  currency: 'IDR',
};
const mockDataWithBigNumber = {
  balance: 4000000,
  openBalance: 8000000,
  expirationDate: '2019-03-23T00:00:00',
  currency: 'IDR',
};

describe('MyWallet', () => {
  let component;

  test('enable adjustFontSizeToFit when number is big', () => {
    component = renderForTest(
      <MyWallet data={mockDataWithBigNumber} adjustsFontSizeToFit />,
    );
    const availableBalanceText = component.getByTestId(
      'availableBalanceFormatted',
    );
    expect(availableBalanceText.props.adjustsFontSizeToFit).toEqual(true);
  });

  test('dont enable adjustFontSizeToFit when number is small', () => {
    component = renderForTest(
      <MyWallet data={mockData} adjustsFontSizeToFit />,
    );
    const availableBalanceText = component.getByTestId(
      'availableBalanceFormatted',
    );
    expect(availableBalanceText.props.adjustsFontSizeToFit).toEqual(false);
  });

  test('should render progressbar to 0 when maximumBalance undefined or 0', () => {
    component = renderForTest(<MyWallet data={null} adjustsFontSizeToFit />);
    const progressBar = component.getByType(ProgressBar);
    expect(progressBar.props.progress).toEqual(0);
  });
});
