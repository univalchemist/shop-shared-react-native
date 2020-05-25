import { getDiabetesRisk } from '../getDiabetesRisk';
import messages from '@messages/en-HK.json';
import { diabetesRiskGreen, diabetesRiskAmber, diabetesRiskRed } from '@images';
import theme from '@theme';

describe('getDiabetesRisk', () => {
  const lifestyleResults = {
    diabetesRisk: 'Low',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getDiabetesRisk(lifestyleResults, theme, intl);

  it('should render correct title', () => {
    expect(result.title).toBe('Diabetes');
  });

  it('should pass isValid true when diabetesRisk can be correctly mapped', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when diabetesRisk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getDiabetesRisk(invalidLifestyleResults, theme, intl);

    expect(invalidResult.isValid).toBe(false);
  });

  it('should not call internatialization when diabetesRisk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getDiabetesRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.diabetesContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.undefinedRisk',
    });
  });

  it('should return correct tips properties', () => {
    expect(result.tips).toEqual({
      category: 'diabetes',
      result: 'Low risk',
      tipDescription:
        'Awesome! Maintain a healthy lifestyle to keep your diabetes risk low. Take an online diabetes risk assessment at least yearly should your lifestyle change.',
    });
  });

  describe('Low diabetes risk', () => {
    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use diabetes risk green icon', () => {
      expect(result.iconImage).toBe(diabetesRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Awesome! Maintain a healthy lifestyle to keep your diabetes risk low. Take an online diabetes risk assessment at least yearly should your lifestyle change.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Low risk');
    });
  });

  describe('High diabetes risk', () => {
    const lifestyleResults = {
      diabetesRisk: 'High',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getDiabetesRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use diabetes risk amber icon', () => {
      expect(result.iconImage).toBe(diabetesRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Consider going for pre-diabetes health screening even if you feel perfectly well. Early detection can result in better outcomes. Click to learn more.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('High risk');
    });
  });

  describe('Very high diabetes risk', () => {
    const lifestyleResults = {
      diabetesRisk: 'VeryHigh',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getDiabetesRisk(lifestyleResults, theme, intl);

    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use diabetes risk red icon', () => {
      expect(result.iconImage).toBe(diabetesRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `You are potentially pre-diabetic. Early detection can guide you in changing your lifestyle and result in better outcomes.  Take a pre-diabetes health screening even if you feel perfectly well. Click to learn more.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Very high risk');
    });
  });
});
