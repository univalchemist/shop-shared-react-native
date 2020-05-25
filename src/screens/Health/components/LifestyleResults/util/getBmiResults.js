import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getBmiResults = (lifestyleResults, theme, intl) => {
  const bmiResultsMapping = {
    Healthy: `${theme.colors.riskGreen}`,
    Overweight: `${theme.colors.riskAmber}`,
    Obese: `${theme.colors.riskRed}`,
    Underweight: `${theme.colors.riskAmber}`,
  };

  const mappedColor = bmiResultsMapping[lifestyleResults.bmiClass];
  const color = mappedColor;
  const textColor = theme.colors.defaultText;
  const status =
    mappedColor &&
    intl.formatMessage({
      id: `health.class.${lifestyleResults.bmiClass}`,
    });
  const description =
    mappedColor &&
    intl.formatMessage({
      id: `health.bmiCard.${lifestyleResults.bmiClass}`,
    });
  const title = intl.formatMessage({
    id: `health.bmi`,
  });
  const score = lifestyleResults.bmiScore;

  const isValid = !!mappedColor && !!score;

  return {
    score,
    color,
    textColor,
    status,
    description,
    title,
    isValid,
    tips: {
      category: TipsCategory.Bmi,
      result: status,
      tipDescription: description,
    },
  };
};
