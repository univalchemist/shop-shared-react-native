import React from 'react';
import { HealthScoreHistoryLoading } from '../HealthScoreHistoryGraph';
import { renderForTest } from '@testUtils';
import { SkeletonPlaceholder } from '@wrappers/components';

describe('HealthScoreHistoryLoading', () => {
  it('should render loader', () => {
    const component = renderForTest(<HealthScoreHistoryLoading />);
    expect(
      component.queryAllByType(SkeletonPlaceholder).length,
    ).toBeGreaterThan(1);
  });
});
