import React from 'react';
import { Text } from 'react-native';
import { renderForTest } from '@testUtils';
import EmptyClinicCard from '../EmptyClinicCard';
import { CardContainer } from '../CardContainer';

describe('EmptyClinicCard', () => {
  const title = component => component.queryAllByType(Text)[0];
  const description = component => component.queryAllByType(Text)[1];

  const someTitle = 'My card title';
  const someDescription = 'Here is a description';
  const renderEmptyClinicCard = ({
    title = someTitle,
    description = someDescription,
  }) =>
    renderForTest(<EmptyClinicCard title={title} description={description} />);

  let emptyClinicCard;
  beforeEach(() => {
    emptyClinicCard = renderEmptyClinicCard({
      title: someTitle,
      description: someDescription,
    });
  });

  it('should show a card for consistent card style', () => {
    expect(emptyClinicCard.queryAllByType(CardContainer).length).toBe(1);
  });

  it('should show 2 text components', () => {
    expect(emptyClinicCard.queryAllByType(Text).length).toBe(2);
  });

  it('should show title text', () => {
    expect(title(emptyClinicCard).props.children).toBe(someTitle);
  });

  it('should show description text', () => {
    expect(description(emptyClinicCard).props.children).toBe(someDescription);
  });
});
