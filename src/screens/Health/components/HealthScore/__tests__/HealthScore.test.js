import React from 'react';
import { renderForTest } from '@testUtils';
import HealthScore from '../index';
import { PromiseStatus } from '@middlewares';
import HealthScoreDisplay, { HealthScoreLoading } from '../HealthScoreDisplay';

describe('HealthScore', () => {
  it('should display loading while waiting for response', () => {
    const healthScore = renderForTest(<HealthScore />, {
      initialState: {
        health: {
          healthScore: {
            status: PromiseStatus.START,
          },
        },
      },
    });
    expect(healthScore.toJSON().children.length).toBe(1);
    expect(healthScore.queryAllByType(HealthScoreLoading).length).toBe(1);
  });

  it('should display health score when data is received successfully', () => {
    const score = 11;
    const healthScore = renderForTest(<HealthScore />, {
      initialState: {
        health: {
          healthScore: {
            score,
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });
    expect(healthScore.toJSON().children.length).toBe(1);
    expect(healthScore.queryAllByType(HealthScoreDisplay).length).toBe(1);
    expect(healthScore.queryAllByType(HealthScoreDisplay)[0].props.score).toBe(
      score,
    );
  });
});
