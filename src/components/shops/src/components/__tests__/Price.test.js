import React from 'react';
import { renderForTest } from '@testUtils';
import Price from '../Price';

const initialState = {
  shop: { config: { currency: { defaultCurrencySymbol: '$SG' } } },
};

describe('Price', () => {
  it('should render properly', () => {
    const Comp = renderForTest(<Price basePrice={1000} finalPrice={500} />, {
      initialState,
    });
    const discountText = Comp.getByText('$SG 500.00');
    const baseText = Comp.getByText('$SG 1,000.00');
    expect(discountText).toBeDefined();
    expect(baseText).toBeDefined();

  });
});
