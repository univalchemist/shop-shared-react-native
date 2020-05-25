import { tobaccoRiskGreen, tobaccoRiskAmber, tobaccoRiskRed } from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getTobaccoRisk = (lifestyleResults, theme, intl) => {
  const TobaccoRiskMapping = {
    NonSmoker: { color: theme.colors.riskGreen, image: tobaccoRiskGreen },
    ExSmoker: { color: theme.colors.riskAmber, image: tobaccoRiskAmber },
    Smoker: { color: theme.colors.riskRed, image: tobaccoRiskRed },
  };
  const mappedObject = TobaccoRiskMapping[lifestyleResults.tobaccoRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.tobaccoContextualData.${lifestyleResults.tobaccoRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.tobacco${lifestyleResults.tobaccoRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.tobacco' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Tobacco,
      result: status,
      tipDescription: description,
    },
  };
};
