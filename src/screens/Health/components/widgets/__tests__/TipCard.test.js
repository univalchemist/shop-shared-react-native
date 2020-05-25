import React from 'react';
import { renderForTest } from '@testUtils';
import { TipCard } from '../TipCard';
import { CallToActionLink } from '../../widgets/CallToActionLink';
import { act, fireEvent } from 'react-native-testing-library';
import { Linking, TouchableHighlight } from 'react-native';
import { externalLinkBlack } from '@images';
import messages from '@messages/en-HK';

describe('Tip Card', () => {
  const Tip = {
    topic: 'How to eat healthily',
    source: 'Dr Ho',
    text: 'Avoid drinking too much bubble tea',
    link: 'https://www.eat-healthy.com',
  };
  const color = '#000';
  const generalTipsCard = renderForTest(<TipCard color={color} {...Tip} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a topic', () => {
    const topic = generalTipsCard.queryAllByText('How to eat healthily');

    expect(topic.length).toBe(1);
  });

  it('should render a source prepended with the word - by', () => {
    const source = generalTipsCard.queryAllByText('by Dr Ho');

    expect(source.length).toBe(1);
  });

  it('should render a description', () => {
    const description = generalTipsCard.queryAllByText(
      'Avoid drinking too much bubble tea',
    );

    expect(description.length).toBe(1);
  });

  it('should render Learn more link with icon', () => {
    const callToActionLink = generalTipsCard.queryAllByType(CallToActionLink);

    expect(callToActionLink.length).toBe(1);
    expect(callToActionLink[0].props.text).toBe(messages['health.learnMore']);
    expect(callToActionLink[0].props.icon).toBe(externalLinkBlack);
  });

  it('should nagivate to passed in link upon pressing on the tip', () => {
    jest.spyOn(Linking, 'openURL');
    act(() => {
      fireEvent.press(generalTipsCard.queryAllByType(TouchableHighlight)[0]);
    });

    expect(Linking.openURL).toHaveBeenCalledWith(Tip.link);
  });

  it('should not nagivate to browser upon press if passed in link is empty', () => {
    jest.spyOn(Linking, 'openURL');
    const data = {
      topic: 'title',
      source: 'someone',
      text: 'long text',
      link: undefined,
    };
    const tipCard = renderForTest(
      <TipCard
        color={color}
        topic={data.topic}
        source={data.source}
        text={data.text}
        link={data.link}
      />,
    );

    act(() => {
      fireEvent.press(tipCard.queryAllByType(TouchableHighlight)[0]);
    });

    expect(Linking.openURL).not.toHaveBeenCalled();
  });
});
