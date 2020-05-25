import React from 'react';
import { renderForTest } from '@testUtils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { HealthScore } from '@screens/Health/components/HealthScore';
import { HealthScoreHistory } from '@screens/Health/components/HealthScoreHistory';
import LifestyleScoreCarousel from '../LifestyleScoreCarousel';

describe('LifestyleScoreCarousel', () => {
  const lifestyleScoreCarousel = renderForTest(<LifestyleScoreCarousel />, {
    initialState: { health: {} },
  });

  it('should render a carousel', () => {
    expect(lifestyleScoreCarousel.queryByType(Carousel)).toBeDefined();
  });

  it('should render health score', () => {
    const healthScore = lifestyleScoreCarousel.queryAllByType(HealthScore);
    expect(healthScore.length).toBe(1);
  });

  it('should render health score history', () => {
    const healthScoreHistory = lifestyleScoreCarousel.queryAllByType(
      HealthScoreHistory,
    );
    expect(healthScoreHistory.length).toBe(1);
  });

  it('should render the pagination for health score and health score history', () => {
    const pagination = lifestyleScoreCarousel.queryAllByType(Pagination);
    expect(pagination.length).toBe(1);
    expect(pagination[0].props.dotsLength).toBe(2);
  });
});
