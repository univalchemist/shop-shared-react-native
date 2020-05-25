import React from 'react';
import LifestyleTipsLayout from '../LifestyleTipLayout';
import { renderForTest } from '@testUtils';
import { TipCard } from '@screens/Health/components/widgets/TipCard';
import { ErrorPanel } from '@wrappers/components';
import messages from '@messages/en-HK';
import { ProductRecommendation } from '@screens/Health/components/ProductRecommendation';

const renderLifestypeTipLayout = (category, result) => {
  const tips = {
    category,
    result,
    tipDescription: 'Text description',
  };

  const lifestyleTips = {
    tips: {
      [category]: [
        {
          text: 'text',
          topic: 'topic 1',
          source: 'source 1',
          link: 'http://test.com',
        },
        {
          text: 'text',
          topic: 'topic 2',
          source: 'source 2',
          link: 'http://test2.com',
        },
      ],
    },
  };

  return renderForTest(<LifestyleTipsLayout lifestyleTipsParameters={tips} />, {
    initialState: {
      health: {
        lifestyleTips,
      },
    },
  });
};

describe('LifestyleTipsLayout', () => {
  beforeAll(() =>
    jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect),
  );

  jest.mock('@store/health/actions', () => ({
    fetchLifestyleTips: jest.fn(() => {}),
  }));

  describe('No tips for result', () => {
    it('should show an error card when tips for a given category is not present', () => {
      const tips = {
        category: 'bmiTest',
        result: 'Underweight',
        tipDescription: 'Text description',
      };

      const lifestyleTips = {
        tips: {
          bmi: [
            {
              text: 'text',
              topic: 'topic 1',
              source: 'source 1',
              link: 'http://test.com',
            },
            {
              text: 'text',
              topic: 'topic 2',
              source: 'source 2',
              link: 'http://test2.com',
            },
          ],
        },
      };

      const component = renderForTest(
        <LifestyleTipsLayout lifestyleTipsParameters={tips} />,
        {
          initialState: {
            health: {
              lifestyleTips,
            },
          },
        },
      );
      expect(component.queryAllByType(ErrorPanel).length).toBe(1);
      expect(component.queryAllByType(TipCard).length).toBe(0);
    });

    it('should show an error card when tips for a given category is null', () => {
      const tips = {
        category: 'bmi',
        result: 'Underweight',
        tipDescription: 'Text description',
      };

      const lifestyleTips = {
        tips: {
          bmi: null,
        },
      };

      const component = renderForTest(
        <LifestyleTipsLayout lifestyleTipsParameters={tips} />,
        {
          initialState: {
            health: {
              lifestyleTips,
            },
          },
        },
      );
      expect(component.queryAllByType(ErrorPanel).length).toBe(1);
      expect(component.queryAllByType(TipCard).length).toBe(0);
    });
  });

  describe('for each valid tip category', () => {
    const categoryResultArr = [
      ['bmi', 'Underweight'],
      ['diabetes', 'High'],
      ['alcohol', 'HeavyDrinker'],
      ['exercise', 'High'],
      ['tobacco', 'High'],
      ['nutrition', 'High'],
      ['mindAndStress', 'High'],
      ['sleep', 'High'],
    ];
    test.each(categoryResultArr)(
      'should render lifestyle tips headers for %s',
      async (category, result) => {
        const component = renderLifestypeTipLayout(category, result);

        expect(
          component.queryAllByText(
            messages[`health.LifestyleTips.ResultText.${category}`],
          ).length,
        ).toBe(1);
      },
    );

    test.each(categoryResultArr)(
      'should render category result for %s',
      async (category, result) => {
        const component = renderLifestypeTipLayout(category, result);

        expect(component.queryAllByText(result).length).toEqual(1);
      },
    );

    test.each(categoryResultArr)(
      'render tip description for %s',
      async (category, result) => {
        const component = renderLifestypeTipLayout(category, result);

        expect(component.queryAllByText('Text description').length).toEqual(1);
      },
    );

    test.each(categoryResultArr)(
      'should render number of tip cards according to lifestyleTips passed for %s',
      async (category, result) => {
        const component = renderLifestypeTipLayout(category, result);

        expect(component.queryAllByType(TipCard).length).toBe(2);
      },
    );

    test.each(categoryResultArr)(
      'should pass link as a prop for %s',
      async (category, result) => {
        const component = renderLifestypeTipLayout(category, result);

        let lifestyleTipCard = component.queryAllByType(TipCard);
        expect(lifestyleTipCard[0].props.link).toEqual('http://test.com');
      },
    );

    test.each(categoryResultArr)(
      'should render product recommendation with title for %s',
      async (category, result) => {
        const FeatureToggle = require('@config/FeatureToggle').default;
        FeatureToggle.TIPS_PRODUCT_RECOMMENDATION.turnOn();

        const component = renderLifestypeTipLayout(category, result);

        const productRecommendation = component.queryAllByType(
          ProductRecommendation,
        );
        expect(productRecommendation.length).toBe(1);
        expect(productRecommendation[0].props.title).toEqual(
          messages[`health.LifestyleTips.ProductRecommendation.${category}`],
        );
      },
    );
  });
});
