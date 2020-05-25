import { getSleepRisk } from '../getSleepRisk';
import messages from '@messages/en-HK.json';
import theme from '@theme';
import { sleepRiskGreen, sleepRiskAmber, sleepRiskRed } from '@images';

describe('getSleepRisk', () => {
  const lifestyleResults = {
    sleepRisk: 'GoodSleeper',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getSleepRisk(lifestyleResults, theme, intl);

  it('should render correct title', () => {
    expect(result.title).toBe('Sleep');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when sleep risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getSleepRisk(invalidLifestyleResults, theme, intl);

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'sleep',
      result: messages['health.class.sleepGoodSleeperRisk'],
      tipDescription: messages['health.sleepContextualData.GoodSleeperRisk'],
    });
  });

  it('should not call internatialization when sleep risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getSleepRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.sleepContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.sleep.undefinedRisk',
    });
  });

  describe('GoodSleeperRisk', () => {
    it('should return Green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use SleepRisk risk green icon', () => {
      expect(result.iconImage).toBe(sleepRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Nice! Try to maintain at least 8 hours sleep each night. It helps you to stay focused and avoid sleep-related health problems.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Good');
    });
  });

  describe('PoorSleeperRisk', () => {
    const lifestyleResults = {
      sleepRisk: 'PoorSleeper',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getSleepRisk(lifestyleResults, theme, intl);

    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use SleepRisk risk red icon', () => {
      expect(result.iconImage).toBe(sleepRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Inadequate sleep can contribute to heart disease, diabetes and impaired cognition. Consider seeking professional help to identify contributing factors and improve the quality of your sleep.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Poor');
    });
  });

  describe('AverageSleeperRisk', () => {
    const lifestyleResults = {
      sleepRisk: 'AverageSleeper',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getSleepRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use SleepRisk risk amber icon', () => {
      expect(result.iconImage).toBe(sleepRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `A good night’s sleep allows the body to rest and recover so you are ready for a productive day ahead. Make sleep a higher priority and try to improve the quality of your sleep.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Average');
    });
  });
});
