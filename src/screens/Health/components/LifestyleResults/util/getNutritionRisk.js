import {
  nutritionRiskGreen,
  nutritionRiskAmber,
  nutritionRiskRed,
} from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getNutritionRisk = (lifestyleResults, theme, intl) => {
  const NutritionRiskMapping = {
    High: { color: theme.colors.riskRed, image: nutritionRiskRed },
    Moderate: { color: theme.colors.riskAmber, image: nutritionRiskAmber },
    Low: { color: theme.colors.riskGreen, image: nutritionRiskGreen },
  };
  const mappedObject = NutritionRiskMapping[lifestyleResults.nutritionRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.nutritionContextualData.${lifestyleResults.nutritionRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.nutrition${lifestyleResults.nutritionRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.nutrition' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Nutrition,
      result: status,
      tipDescription: description,
    },
  };
};
