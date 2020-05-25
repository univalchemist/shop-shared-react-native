import React from 'react';
import { renderForTest } from '@testUtils';
import { Text } from '@wrappers/components';
import HealthScoreError from '../HealthScoreError';
import messages from '@messages/en-HK.json';

describe('HealthScoreError', () => {
  it('should display 3 texts', () => {
    const healthScoreError = renderForTest(<HealthScoreError />);

    expect(healthScoreError.queryAllByType(Text).length).toBe(4);
  });

  it('should display empty result', () => {
    const healthScoreError = renderForTest(<HealthScoreError />);
    expect(healthScoreError.queryAllByType(Text)[0].props.children).toBe(
      messages['health.healthScore.errorEmptyScore'],
    );
  });

  it('should display maximum score', () => {
    const healthScoreError = renderForTest(<HealthScoreError />);

    expect(healthScoreError.queryAllByType(Text)[1].props.children).toBe(
      messages['health.healthScore.maximumScoreDisplay'],
    );
  });

  it('should display error message', () => {
    const healthScoreError = renderForTest(<HealthScoreError />);

    expect(healthScoreError.queryAllByType(Text)[2].props.children).toBe(
      messages['health.healthScore.errorMessage.unableToShow'],
    );
    expect(healthScoreError.queryAllByType(Text)[3].props.children).toBe(
      messages['health.healthScore.errorMessage.tryAgain'],
    );
  });
});
