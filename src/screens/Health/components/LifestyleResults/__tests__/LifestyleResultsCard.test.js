import React from 'react';
import LifestyleResultsCard, {
  Container,
  Score,
} from '../LifestyleResultsCard';
import { renderForTest } from '@testUtils';
import { Image } from '@wrappers/components';
import { diabetesRiskGreen } from '@images';
import { act, fireEvent } from 'react-native-testing-library';
import { LIFESTYLE_TIPS_MODAL } from '@routes';
import { CallToActionLink } from '../../widgets/CallToActionLink';
import messages from '@messages/en-HK';

const navigation = {
  navigate: jest.fn(),
};

describe('LifestyleResultsCard', () => {
  const color = 'red';
  const score = 10;
  const title = 'title';
  const description = 'description';
  const status = 'status';
  const textColor = '#333333';

  let lifestyleResultsCard;
  let lifestyleCard;
  beforeEach(() => {
    lifestyleResultsCard = renderForTest(
      <LifestyleResultsCard
        color={color}
        score={score}
        title={title}
        description={description}
        status={status}
        textColor={textColor}
        navigation={navigation}
      />,
    );
    lifestyleCard = lifestyleResultsCard.queryAllByType(Container);
  });

  it('should render snapshot', () => {
    expect(lifestyleResultsCard.toJSON()).toMatchSnapshot();
  });

  it('shoud render a lifestyle card', () => {
    expect(lifestyleCard.length).toEqual(1);
  });

  it('should render the correct color', () => {
    expect(lifestyleCard[0].props.color).toEqual(color);
  });

  it('should render title, status and description', () => {
    expect(lifestyleResultsCard.queryAllByText(title).length).toEqual(1);
    expect(lifestyleResultsCard.queryAllByText(status).length).toEqual(1);
    expect(lifestyleResultsCard.queryAllByText(description).length).toEqual(1);
  });

  it('should render score to be 10.0', () => {
    const score = lifestyleResultsCard.queryAllByType(Score)[0];
    expect(score.props.children).toEqual('10.0');
  });

  it('should render correct score when iconImage prop is not passed', () => {
    expect(lifestyleResultsCard.queryAllByType(Score).length).toEqual(1);
  });

  it('should not render icon when iconImage prop is not passed', () => {
    const image = lifestyleResultsCard.queryAllByType(Image);

    expect(image.length).toBe(0);
  });

  it('should render icon when iconImage prop is passed', () => {
    const lifestyleResultsCard = renderForTest(
      <LifestyleResultsCard
        color={'red'}
        score={22.7}
        title={'title'}
        description={'Overweight'}
        status={'description really really long'}
        iconImage={diabetesRiskGreen}
        navigation={navigation}
      />,
    );

    const image = lifestyleResultsCard.queryAllByType(Image);
    const score = lifestyleResultsCard.queryAllByType(Score);

    expect(image.length).toBe(1);
    expect(score.length).toBe(0);
    expect(image[0].props.source).toBe(diabetesRiskGreen);
  });

  it('should invoke the callback when clicked', () => {
    const color = 'red';
    const score = 22.7;
    const title = 'title';
    const status = 'Overweight';
    const description = 'description really really long';
    const textColor = '#333333';

    const tips = { category: '', result: '', tipDescription: '' };
    const component = renderForTest(
      <LifestyleResultsCard
        color={color}
        score={score}
        title={title}
        description={description}
        status={status}
        tips={tips}
        textColor={textColor}
        navigation={navigation}
      />,
    );

    const lifestyleCard = component.queryAllByType(Container);
    act(() => {
      fireEvent.press(lifestyleCard[0]);
    });

    expect(navigation.navigate).toHaveBeenCalledWith(LIFESTYLE_TIPS_MODAL, {
      tips,
    });
  });

  it('should render callToActionLink', () => {
    const lifestyleResultsCard = renderForTest(
      <LifestyleResultsCard
        color={'red'}
        score={22.7}
        title={'title'}
        description={'Overweight'}
        status={'description really really long'}
        iconImage={diabetesRiskGreen}
        navigation={navigation}
      />,
    );

    const callToActionLink = lifestyleResultsCard.queryAllByType(
      CallToActionLink,
    );

    expect(callToActionLink.length).toBe(1);
    expect(callToActionLink[0].props.text).toBe(
      messages['health.LifestyleTips.ViewLifestyleTips'],
    );
    expect(callToActionLink[0].props.icon).toBe(undefined);
  });
});
