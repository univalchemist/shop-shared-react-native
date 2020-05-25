import { getTobaccoRisk } from '../getTobaccoRisk';
import messages from '@messages/en-HK.json';
import theme from '@theme';
import { tobaccoRiskGreen, tobaccoRiskAmber, tobaccoRiskRed } from '@images';

describe('getTobaccoRisk', () => {
  const lifestyleResults = {
    tobaccoRisk: 'NonSmoker',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getTobaccoRisk(lifestyleResults, theme, intl);
  it('should render correct title', () => {
    expect(result.title).toBe('Tobacco');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when tobacco risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getTobaccoRisk(invalidLifestyleResults, theme, intl);

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'tobacco',
      result: messages['health.class.tobaccoNonSmokerRisk'],
      tipDescription: messages['health.tobaccoContextualData.NonSmokerRisk'],
    });
  });

  it('should not call internatialization when tobacco risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getTobaccoRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.tobaccoContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.tobacco.undefinedRisk',
    });
  });

  describe('NonSmoker TobaccoRisk risk', () => {
    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use tobaccoRisk risk green icon', () => {
      expect(result.iconImage).toBe(tobaccoRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Good job! Take care of your health by avoiding second-hand smoke. Encourage others around you to stop smoking also!`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Non-smoker');
    });
  });

  describe('Smoker tobaccoRisk risk', () => {
    const lifestyleResults = {
      tobaccoRisk: 'Smoker',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getTobaccoRisk(lifestyleResults, theme, intl);

    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use tobaccoRisk risk red icon', () => {
      expect(result.iconImage).toBe(tobaccoRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Consider quitting to reduce tobacco-related health risks. Your lungs start to heal after a month and you will see improvements in your taste, smell, immunity, energy levels, and more!`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Smoker');
    });
  });

  describe('ExSmoker tobaccoRisk risk', () => {
    const lifestyleResults = {
      tobaccoRisk: 'ExSmoker',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getTobaccoRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use tobaccoRisk risk amber icon', () => {
      expect(result.iconImage).toBe(tobaccoRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Bravo! Quitting is a significant achievement. Take care of your health by avoiding second-hand smoke. Encourage others around you to stop smoking also!`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Ex-smoker');
    });
  });
});
