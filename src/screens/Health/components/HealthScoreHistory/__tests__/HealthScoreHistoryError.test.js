import { renderForTest } from '@testUtils';
import React from 'react';
import HealthScoreHistoryError from '../HealthScoreHistoryError';
import { Text } from '@wrappers/components';
import messages from '@messages/en-HK.json';

describe('HealthScoreHistoryError', () => {
  it('should render error texts', () => {
    const component = renderForTest(<HealthScoreHistoryError />);

    expect(component.queryAllByType(Text)[0].props.children).toBe(
      messages['health.healthScoreHistory.errorMessage.unableToShow'],
    );
    expect(component.queryAllByType(Text)[1].props.children).toBe(
      messages['health.healthScoreHistory.errorMessage.tryAgain'],
    );
    expect(component.queryAllByType(Text).length).toBe(2);
  });
});
