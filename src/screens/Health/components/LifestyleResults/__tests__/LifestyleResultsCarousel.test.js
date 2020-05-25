import React from 'react';
import { renderForTest } from '@testUtils';
import { LifestyleResultsCarousel } from '../LifestyleResultsCarousel';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';
import LifestyleResultsCard from '../LifestyleResultsCard';

describe('LifestyleResultsLoader', () => {
  const validResults = {
    score: 20,
    color: 'red',
    status: 'mock status',
    description: 'mock desc',
    title: 'mock title',
    isValid: true,
    textColor: '#333333',
  };

  const invalidResults = {
    score: 20,
    color: 'red',
    status: 'mock status',
    description: 'mock desc',
    title: 'mock title',
    isValid: false,
    textColor: '#333333',
  };

  const renderLifestyleResultsCarousel = data => {
    return renderForTest(
      <LifestyleResultsCarousel
        data={data}
        cardWidthWithSpacing={0}
        cardHeight={250}
        horizontalMarginBetweenCard={3}
        cardWidth={-3}
        viewportWidth={3}
      />,
    );
  };

  it('should match snapshot', () => {
    const component = renderLifestyleResultsCarousel([validResults]);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should render the carousel', () => {
    const component = renderLifestyleResultsCarousel([validResults]);
    const carousel = component.queryAllByType(Carousel);

    expect(carousel[0]).toBeDefined();
  });

  it('should render number of cards according to number of data', () => {
    const data = [validResults, invalidResults];
    const component = renderLifestyleResultsCarousel(data);

    const lifestyleResultsCard = component.queryAllByType(LifestyleResultsCard);
    const errorCard = component.queryAllByType(ErrorCard);

    expect(lifestyleResultsCard.length).toBe(1);
    expect(errorCard.length).toBe(1);
  });

  it('should render pagination for carousel', () => {
    const data = [validResults, validResults];
    const component = renderLifestyleResultsCarousel(data);

    const pagination = component.queryAllByType(Pagination);

    expect(pagination.length).toBe(1);
    expect(pagination[0].props.dotsLength).toBe(2);
  });

  it('should render lifestyle results card when isValid passed is true ', () => {
    const data = [validResults];
    const component = renderLifestyleResultsCarousel(data);

    const lifestyleResultsCard = component.queryAllByType(LifestyleResultsCard);

    expect(lifestyleResultsCard.length).toEqual(1);
  });

  it('should render error card when isValid passed is false ', () => {
    const data = [invalidResults];
    const component = renderLifestyleResultsCarousel(data);

    const errorCard = component.queryAllByType(ErrorCard);
    expect(errorCard.length).toEqual(1);
  });
});
