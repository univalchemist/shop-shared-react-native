import React from 'react';
import { renderForTest } from '@testUtils';
import LifestyleResultsScreen from '../LifestyleResultsScreen';
import { LifestyleResults } from '@screens/Health/components/LifestyleResults';
import { GeneralTips } from '@screens/Health/components/GeneralTips';
import { PromiseStatus } from '@middlewares';
import { LifestyleNavigationButtons } from '../LifestyleNavigationButtons';
import { FaceAgingResults } from '@screens/Health/components/FaceAgingResults';
import { Image } from '@wrappers/components';
import { FormattedMessage } from 'react-intl';
import { ProductRecommendation } from '@screens/Health/components/ProductRecommendation';
import messages from '@messages/en-HK';
import LifestyleScoreCarousel from '../LifestyleScoreCarousel';

const initialState = {
  health: {
    results: {
      bmi: 180,
      bmiClass: 'Obese',
      bmiPoint: 2,
      totalPoint: 2,
      totalRisk: 'Obese',
      smokeRisk: 'Low',
      alcoholRisk: 'Low',
      exerciseRisk: 'Low',
      sleepRisk: 'Low',
      mentalHealthRisk: 'Low',
      nutritionRisk: 'Low',
    },
    hasLifestyleResults: true,
    fetchUserLifestyleResultsCompleted: true,
    faceAging: {
      faceAgingIsDone: true,
      expectedTotalResults: 2,
      currentTotalResults: 2,
      results: {
        67: {
          healthy: 'healthybase64Image',
          unhealthy: 'unhealthybase64Image',
        },
        75: {
          healthy: 'healthybase64Image',
          unhealthy: 'unhealthybase64Image',
        },
      },
    },
    lifestyleResults: {
      bmiScore: 40,
      bmiClass: 'Obese',
      diabetesRisk: 'Low',
    },
    lifestyleTips: {
      tips: { general: [] },
      status: PromiseStatus.ERROR,
    },
  },
};

const mockNavigation = { navigate: jest.fn() };

describe('LifestyleResultsScreen', () => {
  let lifestyleResultsScreen;

  beforeEach(async () => {
    lifestyleResultsScreen = renderForTest(
      <LifestyleResultsScreen navigation={mockNavigation} />,
      {
        initialState,
      },
    );
  });

  it('should match healthscreen snapshot', async () => {
    expect(lifestyleResultsScreen.toJSON()).toMatchSnapshot();
  });

  it('should render lifestyle score carousel', () => {
    const lifestyleScoreCarousel = lifestyleResultsScreen.queryAllByType(
      LifestyleScoreCarousel,
    );
    expect(lifestyleScoreCarousel.length).toBe(1);
  });

  it('should render lifestyle results component', () => {
    const lifestyleResults = lifestyleResultsScreen.queryAllByType(
      LifestyleResults,
    );
    expect(lifestyleResults.length).toBe(1);
  });

  it('should render general tips component', () => {
    const generalTips = lifestyleResultsScreen.queryAllByType(GeneralTips);
    expect(generalTips.length).toEqual(1);
  });

  it('should render face aging result', () => {
    const faceAgingResult = lifestyleResultsScreen.queryAllByType(
      FaceAgingResults,
    );
    expect(faceAgingResult.length).toBe(1);
  });

  it('should render MainHeroImage', () => {
    const image = lifestyleResultsScreen.queryAllByType(Image);

    expect(image[0].props.source).toEqual({
      testUri: '../../../src/images/mainPageHero.png',
    });
  });

  it('should render Main Header Text', () => {
    const text = lifestyleResultsScreen.queryAllByType(FormattedMessage);

    expect(text[0].props.id).toBe('health.sectionTitle.main');
  });

  describe('LifestyleNavigatorButton', () => {
    it('should render a row of navigation buttons', () => {
      expect(
        lifestyleResultsScreen.queryAllByType(LifestyleNavigationButtons),
      ).toHaveLength(1);
    });
  });

  describe('ProductRecommendations', () => {
    it('should render product recommendations specific to lifestyle results', () => {
      expect(
        lifestyleResultsScreen.getByType(ProductRecommendation),
      ).toBeDefined();
    });

    it('should pass in "suggestions based on my lifestyle" title', () => {
      const productRecommendations = lifestyleResultsScreen.getByType(
        ProductRecommendation,
      );
      expect(productRecommendations.props.title).toEqual(
        messages['health.productRecommendation.title'],
      );
    });
  });
});
