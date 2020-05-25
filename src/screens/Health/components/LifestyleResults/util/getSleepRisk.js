import { sleepRiskGreen, sleepRiskAmber, sleepRiskRed } from '@images';
import { TipsCategory } from '../../LifestyleTipsModal/TipsCategory';

export const getSleepRisk = (lifestyleResults, theme, intl) => {
  const SleepRiskMapping = {
    GoodSleeper: { color: theme.colors.riskGreen, image: sleepRiskGreen },
    AverageSleeper: { color: theme.colors.riskAmber, image: sleepRiskAmber },
    PoorSleeper: { color: theme.colors.riskRed, image: sleepRiskRed },
  };
  const mappedObject = SleepRiskMapping[lifestyleResults.sleepRisk];
  const color = mappedObject && mappedObject.color;
  const iconImage = mappedObject && mappedObject.image;
  const description =
    mappedObject &&
    intl.formatMessage({
      id: `health.sleepContextualData.${lifestyleResults.sleepRisk}Risk`,
    });
  const status =
    mappedObject &&
    intl.formatMessage({
      id: `health.class.sleep${lifestyleResults.sleepRisk}Risk`,
    });
  const title = intl.formatMessage({ id: 'health.sleep' });
  const isValid = !!mappedObject;

  return {
    color,
    iconImage,
    description,
    status,
    title,
    isValid,
    tips: {
      category: TipsCategory.Sleep,
      result: status,
      tipDescription: description,
    },
  };
};
