import React from 'react';
import MultipleClinicsCard, { Title } from '../MultipleClinicsCard';
import { renderForTest } from '@testUtils';
import { Text, TouchableContainer } from '@wrappers/components';
import { CardContainer } from '../CardContainer';
import { fireEvent } from 'react-native-testing-library';

const navigation = {
  navigate: jest.fn(),
};
describe('MultipleClinicsCard', () => {
  const clinics = [
    {
      id: 10,
      name: 'Dr WhoIsThis',
    },
    {
      id: 8,
      name: 'Dr JamesBond',
    },
  ];

  const title = component => component.queryByType(Title);
  const content = component => component.queryByType(Text);
  const contentText = component => content(component).props.children;
  const renderMultipleClinicsCard = ({ clinics = [] }) =>
    renderForTest(
      <MultipleClinicsCard clinics={clinics} navigation={navigation} />,
    );

  let component;
  beforeEach(() => {
    component = renderMultipleClinicsCard({ clinics: clinics });
  });

  it('should render a CardContainer for consistent card style', () => {
    expect(component.queryAllByType(CardContainer)).toHaveLength(1);
  });

  it('should render a touchable container', () => {
    expect(component.queryAllByType(TouchableContainer)).toHaveLength(1);
  });

  it('should render number of clinics at this location for card title', () => {
    expect(title(component).props.children).toBe(`2 clinics at this location`);
  });

  it('should render clinic names for card content', () => {
    expect(contentText(component)).toBe('Dr WhoIsThis, Dr JamesBond');
  });

  it('should limit card content to 3 lines', () => {
    expect(content(component).props.numberOfLines).toBe(3);
  });

  it('should ellipsize the end of card content when it exceeds 3 lines', () => {
    expect(content(component).props.ellipsizeMode).toBe('tail');
  });

  it('should navigate to multipleClinicsListView on clicking the card', () => {
    const touchableContainer = component.queryAllByType(TouchableContainer);

    fireEvent.press(touchableContainer[0]);

    expect(navigation.navigate).toHaveBeenCalledWith(
      'MultipleClinicsListView',
      { clinics },
    );
  });
});
