import { exerciseRiskGreen, exerciseRiskAmber, exerciseRiskRed } from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getExerciseRisk = (lifestyleResults, theme, intl) => {
  const ExerciseRiskMapping = {
    High: { color: theme.colors.riskGreen, image: exerciseRiskGreen },
    LowToModerate: { color: theme.colors.riskAmber, image: exerciseRiskAmber },
    VeryLow: { color: theme.colors.riskRed, image: exerciseRiskRed },
  };
  const mappedObject = ExerciseRiskMapping[lifestyleResults.exerciseRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.exerciseContextualData.${lifestyleResults.exerciseRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.exercise${lifestyleResults.exerciseRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.exercise' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Exercise,
      result: status,
      tipDescription: description,
    },
  };
};
