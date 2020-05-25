import { alcoholRiskGreen, alcoholRiskAmber, alcoholRiskRed } from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getAlcoholRisk = (lifestyleResults, theme, intl) => {
  const AlcoholRiskMapping = {
    None: { color: theme.colors.riskGreen, image: alcoholRiskGreen },
    RegularDrinker: { color: theme.colors.riskAmber, image: alcoholRiskAmber },
    HeavyDrinker: { color: theme.colors.riskRed, image: alcoholRiskRed },
  };
  const mappedObject = AlcoholRiskMapping[lifestyleResults.alcoholRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.alcoholContextualData.${lifestyleResults.alcoholRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.alcohol${lifestyleResults.alcoholRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.alcohol' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Alcohol,
      result: status,
      tipDescription: description,
    },
  };
};
