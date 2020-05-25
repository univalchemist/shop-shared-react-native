import { getExerciseRisk } from '../getExerciseRisk';
import { exerciseRiskGreen, exerciseRiskAmber, exerciseRiskRed } from '@images';
import messages from '@messages/en-HK.json';
import theme from '@theme';

describe('getExerciseRisk', () => {
  const lifestyleResults = {
    exerciseRisk: 'High',
  };

  const intl = {
    formatMessage: jest.fn(({ id }) => {
      return messages[id];
    }),
  };

  const result = getExerciseRisk(lifestyleResults, theme, intl);
  it('should render correct title', () => {
    expect(result.title).toBe('Exercise');
  });

  it('should pass isValid true when all props are valid', () => {
    expect(result.isValid).toBe(true);
  });

  it('should pass isValid false when exercise risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    const invalidResult = getExerciseRisk(invalidLifestyleResults, theme, intl);

    expect(invalidResult.isValid).toBe(false);
  });

  it('should return tips data', () => {
    expect(result.tips).toStrictEqual({
      category: 'exercise',
      result: messages['health.class.exerciseHighRisk'],
      tipDescription: messages['health.exerciseContextualData.HighRisk'],
    });
  });

  it('should not call internatialization when exercise risk cannot be mapped', () => {
    const invalidLifestyleResults = {};
    getExerciseRisk(invalidLifestyleResults, theme, intl);

    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.exerciseContextualData.undefinedRisk',
    });
    expect(intl.formatMessage).not.toBeCalledWith({
      id: 'health.class.exercise.undefinedRisk',
    });
  });

  describe('High ExerciseRisk risk', () => {
    it('should return green color', () => {
      expect(result.color).toBe(theme.colors.riskGreen);
    });

    it('should use ExerciseRisk risk green icon', () => {
      expect(result.iconImage).toBe(exerciseRiskGreen);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Well done! Consistency is key for you. Try 7 light cardio days that burn 200 calories per session than 2 brutal days that burn 700. Or learn new exercise routines for a change.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('High Activity');
    });
  });

  describe('VeryLow ExerciseRisk risk', () => {
    const lifestyleResults = {
      exerciseRisk: 'VeryLow',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getExerciseRisk(lifestyleResults, theme, intl);

    it('should return red color', () => {
      expect(result.color).toBe(theme.colors.riskRed);
    });

    it('should use ExerciseRisk risk red icon', () => {
      expect(result.iconImage).toBe(exerciseRiskRed);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `Being active helps you look and feel good! Starting is always the hardest but find an excuse to walk at least 30 minutes a day, 3 times a week! Or try some activities you can do at home.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Low Activity');
    });
  });

  describe('LowToModerate ExerciseRisk risk', () => {
    const lifestyleResults = {
      exerciseRisk: 'LowToModerate',
    };

    const intl = {
      formatMessage: ({ id }) => {
        return messages[id];
      },
    };

    const result = getExerciseRisk(lifestyleResults, theme, intl);

    it('should return amber color', () => {
      expect(result.color).toBe(theme.colors.riskAmber);
    });

    it('should use ExerciseRisk risk amber icon', () => {
      expect(result.iconImage).toBe(exerciseRiskAmber);
    });

    it('should render correct description message', () => {
      expect(result.description).toBe(
        `There are plenty of health benefits with regular exercise. While you do do some exercise, try planning more intensive and regular daily exercises activities.`,
      );
    });

    it('should render correct status message', () => {
      expect(result.status).toBe('Moderate Activity');
    });
  });
});
