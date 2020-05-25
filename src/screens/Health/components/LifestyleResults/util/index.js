import { getBmiResults } from './getBmiResults';
import { getDiabetesRisk } from './getDiabetesRisk';
import { getNutritionRisk } from './getNutritionRisk';
import { getAlcoholRisk } from './getAlcoholRisk';
import { getTobaccoRisk } from './getTobaccoRisk';
import { getExerciseRisk } from './getExerciseRisk';
import { getSleepRisk } from './getSleepRisk';
import { getMindAndStressRisk } from './getMindAndStressRisk';

const parserMap = {
  bmiClass: getBmiResults,
  diabetesRisk: getDiabetesRisk,
  alcoholRisk: getAlcoholRisk,
  tobaccoRisk: getTobaccoRisk,
  exerciseRisk: getExerciseRisk,
  nutritionRisk: getNutritionRisk,
  sleepRisk: getSleepRisk,
  mindAndStressRisk: getMindAndStressRisk,
};

export const getLifestyleResults = (lifestyleResults, theme, intl) => {
  return Object.keys(parserMap).map(key =>
    parserMap[key](lifestyleResults, theme, intl),
  );
};
