import React from 'react';
import { renderForTest } from '@testUtils';
import { TrackedCarousel } from '../Carousel';
import { Carousel } from '@cxa-rn/components';
import { Text } from 'react-native';

const data = [
  {
    title: 'Item 1',
    text: 'Text 1',
  },
  {
    title: 'Item 2',
    text: 'Text 2',
  },
];

describe('TrackedCarousel', () => {
  it('should call snapToItem and logAction', () => {
    const component = renderForTest(
      <TrackedCarousel
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        data={data}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        sliderWidth={300}
        itemWidth={300}
        onSnapToItem={jest.fn()}
        actionParams={{
          category: 'LIFESTYLE_OVERVIEW',
          action: 'Horizontal scroll of more lifestyle tips',
        }}
      />,
    );

    const carousel = component.queryAllByType(Carousel);
    carousel[0].props.onSnapToItem(1);
    expect(carousel.length).toEqual(1);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should not call snapToItem and logAction', () => {
    const component = renderForTest(
      <TrackedCarousel
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        data={data}
        renderItem={({ item }) => <Text>{item.text}</Text>}
        sliderWidth={300}
        itemWidth={300}
      />,
    );

    const carousel = component.queryAllByType(Carousel);
    carousel[0].props.onSnapToItem(2);
    expect(carousel.length).toEqual(1);
  });
});
