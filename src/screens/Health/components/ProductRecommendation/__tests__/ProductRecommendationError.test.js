import React from 'react';
import { renderForTest } from '@testUtils';
import ProductRecommendationError from '../ProductRecommendationError';
import { ErrorText } from '@wrappers/components';
import messages from '@messages/en-HK';

describe('ProductRecommendationError', () => {
  const title = 'some-title';
  const component = renderForTest(<ProductRecommendationError title={title} />);

  it('should match snapshot', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render title passed in', () => {
    expect(component.getByText(title)).toBeDefined();
  });

  it('should render expected texts', () => {
    expect(
      component.getByText(messages['health.productRecommendation.tryAgain']),
    ).toBeDefined();
    expect(
      component.getByText(
        messages['health.productRecommendation.loadingError'],
      ),
    ).toBeDefined();
  });

  it('should be accesible', () => {
    const errorTexts = component.getAllByType(ErrorText);

    expect(errorTexts[0].props.accessibilityLabel).toEqual(
      messages['health.productRecommendation.loadingError'],
    );
    expect(errorTexts[1].props.accessibilityLabel).toEqual(
      messages['health.productRecommendation.tryAgain'],
    );
  });
});
