import { getLifestyleResults } from '../index';
import theme from '@theme';
import messages from '@messages/en-HK.json';
import {
  diabetesRiskGreen,
  nutritionRiskGreen,
  alcoholRiskGreen,
  tobaccoRiskGreen,
  exerciseRiskGreen,
  sleepRiskRed,
  mindAndStressRiskAmber,
} from '@images';

describe('LifestyleResults Parser', () => {
  const intl = {
    formatMessage: ({ id }) => {
      return messages[id];
    },
  };

  const errorReducer = (accumulator, currentValue) => {
    if (currentValue.isValid === false) {
      accumulator += 1;
    }
    return accumulator;
  };

  describe('BmiResult', () => {
    const lifestyleResultsWithBmi = {
      bmiScore: '30',
      bmiClass: 'Healthy',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithBmi,
      theme,
      intl,
    );

    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithBmi, bmiClass: 'test invalid' },
      theme,
      intl,
    );

    it('should result Array has valid BmiResult with valid Bmi data', async () => {
      expect(
        resultArray.some(item => item.color === theme.colors.riskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid BmiResult with invalid Bmi data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.bmi`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('DiabetesResult', () => {
    const lifestyleResultsWithDiabetes = {
      diabetesRisk: 'Low',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithDiabetes,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithDiabetes, diabetesRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid DiabetesResult with valid data', async () => {
      expect(
        resultArray.some(item => item.iconImage === diabetesRiskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid DiabetesResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.diabetes`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('AlcoholResult', () => {
    const lifestyleResultsWithAlcohol = {
      alcoholRisk: 'None',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithAlcohol,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithAlcohol, alcoholRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid AlcoholResult with valid  data', async () => {
      expect(
        resultArray.some(item => item.iconImage === alcoholRiskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid AlcoholResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.alcohol`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('TobaccoResult', () => {
    const lifestyleResultsWithTobacco = {
      tobaccoRisk: 'NonSmoker',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithTobacco,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithTobacco, tobaccoRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid AlcoholResult with valid  data', async () => {
      expect(
        resultArray.some(item => item.iconImage === tobaccoRiskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid AlcoholResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.tobacco`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('ExerciseResult', () => {
    const lifestyleResultsWithExercise = {
      exerciseRisk: 'High',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithExercise,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithExercise, exerciseRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid AlcoholResult with valid  data', async () => {
      expect(
        resultArray.some(item => item.iconImage === exerciseRiskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid AlcoholResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.exercise`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('NutritionResult', () => {
    const lifestyleResultsWithNutrition = {
      nutritionRisk: 'Low',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithNutrition,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithNutrition, nutritionRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid NutritionResult with valid data', async () => {
      expect(
        resultArray.some(item => item.iconImage === nutritionRiskGreen),
      ).toBe(true);
    });

    it('should result Array has invalid BmiResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.nutrition`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('SleepResult', () => {
    const lifestyleResultsWithSleep = {
      sleepRisk: 'PoorSleeper',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithSleep,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      { ...lifestyleResultsWithSleep, sleepRisk: 'test invalid' },
      theme,
      intl,
    );
    it('should result Array has valid Result with valid data', async () => {
      expect(resultArray.some(item => item.iconImage === sleepRiskRed)).toBe(
        true,
      );
    });

    it('should result Array has invalid BmiResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.sleep`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });

  describe('MindAndStressResult', () => {
    const lifestyleResultsWithMindAndStress = {
      mindAndStressRisk: 'BeCareful',
    };
    const resultArray = getLifestyleResults(
      lifestyleResultsWithMindAndStress,
      theme,
      intl,
    );
    const invalidResultArray = getLifestyleResults(
      {
        ...lifestyleResultsWithMindAndStress,
        mindAndStressRisk: 'test invalid',
      },
      theme,
      intl,
    );
    it('should result Array has valid Result with valid data', async () => {
      expect(
        resultArray.some(item => item.iconImage === mindAndStressRiskAmber),
      ).toBe(true);
    });

    it('should result Array has invalid BmiResult with invalid data', async () => {
      expect(invalidResultArray.reduce(errorReducer, 0)).toBeGreaterThanOrEqual(
        1,
      );
      expect(
        invalidResultArray.some(
          result =>
            result.title ===
              intl.formatMessage({
                id: `health.mindAndStress`,
              }) && result.isValid === false,
        ),
      ).toBe(true);
    });
  });
});
