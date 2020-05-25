import { getMindAndStressRisk } from '../getMindAndStressRisk';
import messages from '@messages/en-HK.json';
import theme from '@theme';
import {
  mindAndStressRiskGreen,
  mindAndStressRiskAmber,
  mindAndStressRiskRed,
} from '@images';

describe('getMindAndStressRisk', () => {
  const lifestyleResults = {
    mindAndStressRisk: 'Normal',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getMindAndStressRisk(lifestyleResults, theme, intl);

  it('should render correct title', () => {
    expect(result.title).toBe('Mind & stress');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when mindAndStress risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getMindAndStressRisk(
      invalidLifestyleResults,
      theme,
      intl,
    );

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'mindAndStress',
      result: messages['health.class.mindAndStressNormalRisk'],
      tipDescription: messages['health.mindAndStressContextualData.NormalRisk'],
    });
  });

  it('should not call internatialization when mindAndStress risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getMindAndStressRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.mindAndStressContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.mindAndStress.undefinedRisk',
    });
  });

  describe('Normal MindAndStressRisk risk', () => {
    it('should return Green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use MindAndStressRisk risk green icon', () => {
      expect(result.iconImage).toBe(mindAndStressRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Keep it up! Focus on the present. Don't get caught up thinking about the past or worrying too much into the future. Mental wellness is as important as physical wellness. Self-assess your mental wellness on a regular basis.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Normal');
    });
  });

  describe('AtRisk MindAndStressRisk risk', () => {
    const lifestyleResults = {
      mindAndStressRisk: 'AtRisk',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getMindAndStressRisk(lifestyleResults, theme, intl);

    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use MindAndStressRisk risk red icon', () => {
      expect(result.iconImage).toBe(mindAndStressRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Set time aside to unwind or your mental and physical health can suffer. Identify and manage the sources of your negative emotions. It can be difficult doing this alone and it’s okay to seek support!`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('At risk');
    });
  });

  describe('Average MindAndStressRisk risk', () => {
    const lifestyleResults = {
      mindAndStressRisk: 'BeCareful',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getMindAndStressRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use MindAndStressRisk risk amber icon', () => {
      expect(result.iconImage).toBe(mindAndStressRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Besides physical health, it is equally important to take care of your mental wellbeing. Your health will suffer if you feel depressed often. Take time to identify and manage the sources of your negative emotions.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Be careful');
    });
  });
});
