import {
  mindAndStressRiskGreen,
  mindAndStressRiskAmber,
  mindAndStressRiskRed,
} from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getMindAndStressRisk = (lifestyleResults, theme, intl) => {
  const MindAndStressRiskMapping = {
    Normal: { color: theme.colors.riskGreen, image: mindAndStressRiskGreen },
    BeCareful: { color: theme.colors.riskAmber, image: mindAndStressRiskAmber },
    AtRisk: { color: theme.colors.riskRed, image: mindAndStressRiskRed },
  };
  const mappedObject =
    MindAndStressRiskMapping[lifestyleResults.mindAndStressRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.mindAndStressContextualData.${lifestyleResults.mindAndStressRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.mindAndStress${lifestyleResults.mindAndStressRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.mindAndStress' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.MindAndStress,
      result: status,
      tipDescription: description,
    },
  };
};
