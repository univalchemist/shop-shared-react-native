import React from 'react';
import { ErrorCard } from '../ErrorCard';
import { renderForTest } from '@testUtils';
import messages from '@messages/en-HK.json';

describe('Error Card', () => {
  let errorCard = renderForTest(<ErrorCard color={'#FFF'} />);

  it.skip('should match the snapshot', () => {
    expect(errorCard.toJSON()).toMatchSnapshot();
  });

  it('should render text Unable to show data', () => {
    const unableToShowError = errorCard.queryAllByText(
      messages['health.lifestyleimage.errorMessage.unableToShow'],
    );

    expect(unableToShowError.length).toBe(1);
  });

  it('should render text Try again later', () => {
    const tryAgainError = errorCard.queryAllByText(
      messages['health.lifestyleimage.errorMessage.tryAgain'],
    );

    expect(tryAgainError.length).toBe(1);
  });
});
