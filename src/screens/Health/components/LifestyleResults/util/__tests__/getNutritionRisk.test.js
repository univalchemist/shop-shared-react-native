import { getNutritionRisk } from '../getNutritionRisk';
import messages from '@messages/en-HK.json';
import theme from '@theme';
import {
  nutritionRiskGreen,
  nutritionRiskAmber,
  nutritionRiskRed,
} from '@images';

describe('getNutritionRisk', () => {
  const lifestyleResults = {
    nutritionRisk: 'Low',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getNutritionRisk(lifestyleResults, theme, intl);

  it('should render correct title', () => {
    expect(result.title).toBe('Nutrition');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when nutrition risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getNutritionRisk(
      invalidLifestyleResults,
      theme,
      intl,
    );

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'nutrition',
      result: messages['health.class.nutritionLowRisk'],
      tipDescription: messages['health.nutritionContextualData.LowRisk'],
    });
  });

  it('should not call internatialization when nutrition risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getNutritionRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.nutritionContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.nutrition.undefinedRisk',
    });
  });

  describe('Low Nutrition risk', () => {
    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use Nutrition risk red icon', () => {
      expect(result.iconImage).toBe(nutritionRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `You understand self-control and good nutrition is the key to maintaining a healthy diet. Stay informed to help you and your family continue on your healthy nutrition journey.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Good self-control');
    });
  });

  describe('High Nutrition risk', () => {
    const lifestyleResults = {
      nutritionRisk: 'High',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getNutritionRisk(lifestyleResults, theme, intl);

    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use Nutrition risk green icon', () => {
      expect(result.iconImage).toBe(nutritionRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Temptations and our food choices can affect our body in many ways. Learn how your diet impacts your health risks and how taking control of what you eat can lead to better outcomes.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Low self-control');
    });
  });

  describe('Moderate Nutrition risk', () => {
    const lifestyleResults = {
      nutritionRisk: 'Moderate',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getNutritionRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use Nutrition risk amber icon', () => {
      expect(result.iconImage).toBe(nutritionRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Controlling and resisting temptation to certain foods can be difficult in your culture. Learn about healthy alternatives to help you stay focused on keeping a healthy diet.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Moderate self-control');
    });
  });
});
