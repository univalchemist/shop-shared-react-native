import React from 'react';
import LifestyleResults from '../index';
import { renderForTest } from '@testUtils';
import { LifestyleResultsCarousel } from '../LifestyleResultsCarousel';
import { PromiseStatus } from '@middlewares';
import { LifestyleResultsLoader } from '../LifestyleResultsLoader';
import { TextSkeletonPlaceholder } from '@wrappers/components';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';
import { FormattedMessage } from 'react-intl';

describe('LifestyleResults', () => {
  const lifestyleResults = {
    bmiClass: 'Healthy',
    bmiScore: 30,
    diabetesRisk: 'Low',
    nutritionRisk: 'High',
    alcoholRisk: 'None',
    tobaccoRisk: 'NonSmoker',
    exerciseRisk: 'VeryLow',
    sleepRisk: 'PoorSleeper',
    mindAndStressRisk: 'Normal',
  };

  it('should show section title text', () => {
    const generalTipComponent = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.SUCCESS,
          lifestyleResults,
        },
      },
    });
    const sectionTitle = generalTipComponent.queryAllByType(
      FormattedMessage,
    )[0];
    expect(sectionTitle.props.id).toBe('health.sectionTitle.lifestyleResults');
  });

  it('should render lifestyle results carousel when fetching is successful', async () => {
    const component = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.SUCCESS,
          lifestyleResults,
        },
      },
    });

    const carousel = component.queryAllByType(LifestyleResultsCarousel);

    expect(carousel).toBeDefined();
  });

  it('should render carousel loader with skeleton placeholder when fetching is in progress', async () => {
    const component = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.START,
          lifestyleResults,
        },
      },
    });

    const carousel = component.queryAllByType(LifestyleResultsLoader);
    const textSkeletonPlaceholders = component.queryAllByType(
      TextSkeletonPlaceholder,
    );

    expect(carousel).toBeDefined();
    expect(textSkeletonPlaceholders.length).toEqual(7);
  });

  it('should render lifestyle results error card when failed to retrieve lifestyle results', async () => {
    const component = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.ERROR,
          lifestyleResults,
        },
      },
    });

    const errorCard = component.queryAllByType(ErrorCard);

    expect(errorCard.length).toBe(1);
  });

  it('should render results carousel without error card when retrieve all valid Results', async () => {
    const component = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.SUCCESS,
          lifestyleResults,
        },
      },
    });

    const errorCard = component.queryAllByType(ErrorCard);

    expect(errorCard.length).toBe(0);
  });

  it('should render results error card when retrieve invalidate Result', async () => {
    const component = renderForTest(<LifestyleResults />, {
      initialState: {
        health: {
          fetchUserLifestyleResultsStatus: PromiseStatus.SUCCESS,
          lifestyleResults: {
            ...lifestyleResults,
            nutritionRisk: 'test invalidate',
          },
        },
      },
    });

    const errorCard = component.queryAllByType(ErrorCard);

    expect(errorCard.length).toBeGreaterThanOrEqual(1);
  });
});
