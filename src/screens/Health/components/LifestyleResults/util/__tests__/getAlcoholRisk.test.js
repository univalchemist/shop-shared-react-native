import { getAlcoholRisk } from '../getAlcoholRisk';
import messages from '@messages/en-HK.json';
import theme from '@theme';
import { alcoholRiskGreen, alcoholRiskAmber, alcoholRiskRed } from '@images';

describe('getAlcoholRisk', () => {
  const lifestyleResults = {
    alcoholRisk: 'HeavyDrinker',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getAlcoholRisk(lifestyleResults, theme, intl);

  it('should render correct title', () => {
    expect(result.title).toBe('Alcohol');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when alcohol risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getAlcoholRisk(invalidLifestyleResults, theme, intl);

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'alcohol',
      result: messages['health.class.alcoholHeavyDrinkerRisk'],
      tipDescription: messages['health.alcoholContextualData.HeavyDrinkerRisk'],
    });
  });

  it('should not call internatialization when alcohol risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getAlcoholRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.alcoholContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.alcohol.undefinedRisk',
    });
  });

  describe('HeavyDrinker Alcohol risk', () => {
    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use Alcohol risk red icon', () => {
      expect(result.iconImage).toBe(alcoholRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Your current consumption is high and potentially harmful to your body. Reduce your alcohol intake to lessen alcohol-related health risks.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Heavy drinker');
    });
  });

  describe('None Alcohol risk', () => {
    const lifestyleResults = {
      alcoholRisk: 'None',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getAlcoholRisk(lifestyleResults, theme, intl);

    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use Alcohol risk green icon', () => {
      expect(result.iconImage).toBe(alcoholRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Congratulations! Keeping to a “no” or “low” alcohol lifestyle can be tough socially but minimises alcohol-related risks. Encourage others around you to do the same!`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('None');
    });
  });

  describe('RegularDrinker Alcohol risk', () => {
    const lifestyleResults = {
      alcoholRisk: 'RegularDrinker',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getAlcoholRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use Alcohol risk amber icon', () => {
      expect(result.iconImage).toBe(alcoholRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Enjoy yourself but remember the count! Be careful not to exceed 2 standard drinks a day. Stay informed about alcohol-related risks and dependencies.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Regular drinker');
    });
  });
});
