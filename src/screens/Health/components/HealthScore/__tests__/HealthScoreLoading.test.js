import React from 'react';
import { renderForTest } from '@testUtils';
import { SkeletonPlaceholder } from '@wrappers/components';
import { HealthScoreLoading } from '../HealthScoreDisplay';

describe('HealthScoreLoading', () => {
  it('should render placeholder', () => {
    const healthScoreLoading = renderForTest(<HealthScoreLoading />);
    expect(
      healthScoreLoading.queryAllByType(SkeletonPlaceholder).length,
    ).toBeGreaterThan(1);
  });
});
