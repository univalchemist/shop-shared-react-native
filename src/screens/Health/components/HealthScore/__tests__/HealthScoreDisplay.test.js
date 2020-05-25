import React from 'react';
import { renderForTest } from '@testUtils';
import HealthScoreDisplay from '../HealthScoreDisplay';
import messages from '@messages/en-HK.json';

describe('HealthScoreDisplay', () => {
  it('should show score rounded to nearest integer', () => {
    const score = 11.89;
    const healthScoreDisplay = renderForTest(
      <HealthScoreDisplay score={score} />,
    );

    expect(healthScoreDisplay.getByText('12')).toBeDefined();
  });

  it('should show maximum score', () => {
    const healthScoreDisplay = renderForTest(<HealthScoreDisplay />);
    expect(
      healthScoreDisplay.getByText(
        messages['health.healthScore.maximumScoreDisplay'],
      ),
    ).toBeDefined();
  });

  it('should show score description', () => {
    const healthScoreDisplay = renderForTest(<HealthScoreDisplay />);
    expect(
      healthScoreDisplay.getByText(
        messages['health.healthScore.scoreDescription'],
      ),
    ).toBeDefined();
  });
});
