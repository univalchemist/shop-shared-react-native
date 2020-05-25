import React from 'react';
import { renderForTest } from '@testUtils';
import { LifestyleResultsLoader } from '../LifestyleResultsLoader';
import { TextSkeletonPlaceholder } from '@wrappers/components';

describe('LifestyleResultsLoader', () => {
  let component;
  beforeEach(() => {
    component = renderForTest(
      <LifestyleResultsLoader
        cardWidthWithSpacing={0}
        cardHeight={252.5}
        horizontalMarginBetweenCard={3}
      />,
    );
  });

  it('should render 7 TextSkeletonPlaceholder', () => {
    const textSkeletonPlaceholder = component.queryAllByType(
      TextSkeletonPlaceholder,
    );

    expect(textSkeletonPlaceholder.length).toEqual(7);
  });
});
