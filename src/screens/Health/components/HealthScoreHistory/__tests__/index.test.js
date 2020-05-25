import React from 'react';
import { renderForTest } from '@testUtils';
import { HealthScoreHistory } from '@screens/Health/components';
import {
  HealthScoreHistoryGraph,
  HealthScoreHistoryLoading,
} from '../HealthScoreHistoryGraph';
import HealthScoreHistoryError from '../HealthScoreHistoryError';
import { PromiseStatus } from '@middlewares';

describe('HealthScoreHistory', () => {
  it('should render HealthScoreHistoryGraph if data is successfully passed', () => {
    const data = [{ score: 10, createdOn: '2019-06-17T10:00:00' }];
    const healthScoreHistory = renderForTest(<HealthScoreHistory />, {
      initialState: {
        health: {
          healthScoreHistory: {
            data,
            status: PromiseStatus.SUCCESS,
          },
        },
      },
    });
    expect(healthScoreHistory.toJSON().children.length).toBe(1);
    expect(
      healthScoreHistory.queryAllByType(HealthScoreHistoryGraph).length,
    ).toBe(1);
    expect(
      healthScoreHistory.queryAllByType(HealthScoreHistoryGraph)[0].props.data,
    ).toBe(data);
  });

  it('should display loading while waiting for response', () => {
    const healthScoreHistory = renderForTest(<HealthScoreHistory />, {
      initialState: {
        health: {
          healthScoreHistory: {
            status: PromiseStatus.START,
          },
        },
      },
    });
    expect(healthScoreHistory.toJSON().children.length).toBe(1);
    expect(
      healthScoreHistory.queryAllByType(HealthScoreHistoryLoading).length,
    ).toBe(1);
  });

  it('should display error message when service response when error', () => {
    const healthScoreHistory = renderForTest(<HealthScoreHistory />, {
      initialState: {
        health: {
          healthScoreHistory: {
            status: PromiseStatus.ERROR,
          },
        },
      },
    });
    expect(
      healthScoreHistory.queryAllByType(HealthScoreHistoryError).length,
    ).toBe(1);
  });
});
