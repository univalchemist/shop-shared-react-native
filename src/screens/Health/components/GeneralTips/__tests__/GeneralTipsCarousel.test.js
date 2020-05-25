import React from 'react';
import { renderForTest } from '@testUtils';
import { GeneralTipsCarousel } from '../GeneralTipsCarousel';
import { TipCard } from '@screens/Health/components/widgets/TipCard';
import { Pagination } from 'react-native-snap-carousel';

describe('General Tips Carousel', () => {
  const data = [
    {
      topic: 'How to eat healthily',
      source: 'Dr Ho',
      text: 'Avoid drinking too much bubble tea',
      link: 'https://www.eat-healthy.com',
    },
    {
      topic: 'How to eat healthily',
      source: 'Dr Ho',
      text: 'Avoid drinking too much bubble tea',
      link: 'https://www.eat-healthy.com',
    },
  ];

  it('should render two general tips', () => {
    const generalTipsCarousel = renderForTest(
      <GeneralTipsCarousel
        data={data}
        cardWidthWithSpacing={0}
        cardHeight={250}
        horizontalMarginBetweenCard={3}
        viewportWidth={3}
      />,
    );

    const generalTipsCards = generalTipsCarousel.queryAllByType(TipCard);

    expect(generalTipsCards.length).toBe(2);
  });

  it('should render pagination for carousel', () => {
    const generalTipsCarousel = renderForTest(
      <GeneralTipsCarousel
        data={data}
        cardWidthWithSpacing={0}
        cardHeight={250}
        horizontalMarginBetweenCard={3}
        viewportWidth={3}
      />,
    );

    const pagination = generalTipsCarousel.queryAllByType(Pagination);

    expect(pagination.length).toBe(1);
    expect(pagination[0].props.dotsLength).toBe(2);
  });
});
