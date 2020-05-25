import React from 'react';
import { CardLoader } from '../CardLoader';
import { renderForTest } from '@testUtils';

describe('Card Loader', () => {
  let cardLoader = renderForTest(<CardLoader width={10} />);

  it('should match the snapshot', () => {
    expect(cardLoader.toJSON()).toMatchSnapshot();
  });
});
