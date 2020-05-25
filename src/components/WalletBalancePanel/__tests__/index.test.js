import { renderForTest } from '@testUtils';
import React from 'react';
import WalletBalancePanel from '../index';

describe('WalletBalancePanel', () => {
  it('should render correctly with balance', () => {
    const component = renderForTest(<WalletBalancePanel balance={1000} />);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render correctly with text', () => {
    const component = renderForTest(
      <WalletBalancePanel text={'Not available'} />,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
