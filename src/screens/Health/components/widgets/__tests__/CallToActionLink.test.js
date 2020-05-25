import React from 'react';
import { CallToActionLink } from '../CallToActionLink';
import { renderForTest } from '@testUtils';
import { learnMoreIcon } from '@images';
import { Image, Divider } from '@wrappers/components';

describe('CallToActionLink', () => {
  it('should render text that is passed in', () => {
    const link = 'http://test.com';
    const text = 'Some Text';
    const component = renderForTest(
      <CallToActionLink text={text} link={link} />,
    );

    const learnMore = component.queryAllByText(text);

    expect(learnMore.length).toBe(1);
  });

  it('should render icon passed by props', () => {
    const link = 'http://test.com';
    const component = renderForTest(
      <CallToActionLink link={link} icon={learnMoreIcon} />,
    );

    const image = component.queryAllByType(Image);

    expect(image.length).toBe(1);
    expect(image[0].props.source).toBe(learnMoreIcon);
  });

  it('should not render icon if nothing is passed to icon prop ', () => {
    const link = 'http://test.com';
    const component = renderForTest(<CallToActionLink link={link} />);

    const image = component.queryAllByType(Image);

    expect(image.length).toBe(0);
  });

  it('should render divider', () => {
    const link = 'http://test.com';
    const component = renderForTest(<CallToActionLink link={link} />);

    const divider = component.queryAllByType(Divider);

    expect(divider.length).toBe(1);
  });
});
