import { diabetesRiskGreen, diabetesRiskAmber, diabetesRiskRed } from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getDiabetesRisk = (lifestyleResults, theme, intl) => {
  const diabetesRiskMapping = {
    Low: { color: theme.colors.riskGreen, image: diabetesRiskGreen },
    High: { color: theme.colors.riskAmber, image: diabetesRiskAmber },
    VeryHigh: { color: theme.colors.riskRed, image: diabetesRiskRed },
  };
  const mappedObject = diabetesRiskMapping[lifestyleResults.diabetesRisk];

  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.diabetesContextualData.${lifestyleResults.diabetesRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.${lifestyleResults.diabetesRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.diabetes' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Diabetes,
      result: status,
      tipDescription: description,
    },
  };
};
