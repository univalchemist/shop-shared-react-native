import React from 'react';
import { renderForTest } from '@testUtils';
import GeneralTips from '../index';
import { GeneralTipsCarousel } from '../GeneralTipsCarousel';
import { GeneralTipsLoader } from '../GeneralTipsLoader';
import { PromiseStatus } from '@middlewares';
import { ErrorCard } from '@screens/Health/components/widgets/ErrorCard';
import { FormattedMessage } from 'react-intl';

describe('General Tips', () => {
  const lifestyleTips = {
    tips: {
      general: [
        {
          topic: 'How to eat healthily',
          source: 'Dr Ho',
          text: 'Avoid drinking too much bubble tea',
          link: 'https://www.eat-healthy.com',
        },
      ],
    },
    status: PromiseStatus.SUCCESS,
  };

  it('should render a carousel of general tips', () => {
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });

    const carousel = generalTipComponent.queryAllByType(GeneralTipsCarousel);

    expect(carousel.length).toBe(1);
  });

  it('should pass general tips to carousel when fetching tips is successful', () => {
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });

    const carousel = generalTipComponent.queryAllByType(GeneralTipsCarousel);

    expect(carousel[0].props.data.length).toBe(1);
    expect(carousel[0].props.data[0].topic).toBe('How to eat healthily');
  });

  it('should show error card and no carousel when fetching tips is successful but no general tips are available', () => {
    lifestyleTips.tips = {};
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });

    const carousel = generalTipComponent.queryAllByType(GeneralTipsCarousel);
    const errorCard = generalTipComponent.queryAllByType(ErrorCard);

    expect(carousel.length).toBe(0);
    expect(errorCard.length).toBe(1);
  });

  it('should show error card and no carousel when fetching tips is unsuccessful', () => {
    lifestyleTips.status = PromiseStatus.ERROR;
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });

    const carousel = generalTipComponent.queryAllByType(GeneralTipsCarousel);
    const errorCard = generalTipComponent.queryAllByType(ErrorCard);

    expect(carousel.length).toBe(0);
    expect(errorCard.length).toBe(1);
  });

  it('should show loader card and no carousel when fetching tips is in progress', () => {
    lifestyleTips.status = PromiseStatus.START;
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });

    const carousel = generalTipComponent.queryAllByType(GeneralTipsCarousel);
    const loader = generalTipComponent.queryAllByType(GeneralTipsLoader);

    expect(carousel.length).toBe(0);
    expect(loader.length).toBe(1);
  });

  it('should show section title text', () => {
    const generalTipComponent = renderForTest(<GeneralTips />, {
      initialState: {
        health: {
          lifestyleTips,
        },
      },
    });
    const sectionTitle = generalTipComponent.queryAllByType(
      FormattedMessage,
    )[0];
    expect(sectionTitle.props.id).toBe('health.sectionTitle.generalTips');
  });
});
