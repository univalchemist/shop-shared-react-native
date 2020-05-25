import React from 'react';
import PropTypes from 'prop-types';
import {
  healthIndicatorGreen,
  healthIndicatorPurple,
  healthIndicatorOrange,
  healthIndicatorRed,
  alcoholHighRisk,
  alcoholLowRisk,
  exerciseHighRisk,
  exerciseLowRisk,
  smokingLowRisk,
  smokingHighRisk,
  sleepLowRisk,
  sleepHighRisk,
  nutritionLowRisk,
  nutritionHighRisk,
  nutritionModerateRisk,
  mentalHealthLowRisk,
  mentalHealthHighRisk,
  mentalHealthModerateRisk,
} from '@images';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-elements';
import { Text, Image } from '@wrappers/components';
import theme from '@theme';
import { FormattedMessage } from 'react-intl';

const styles = StyleSheet.create({
  cardStyle: {
    width: 200,
    display: 'flex',
    borderRadius: 4,
    margin: 5,
    flex: 1,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,

    elevation: 5,
  },
  indicatorStyles: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    alignContent: 'space-between',
  },
  labelStyle: {
    fontWeight: '600',
    paddingLeft: 7,
    letterSpacing: 1.6,
    fontSize: theme.fontSizes[0],
    lineHeight: 16,
  },
  healthStatusStyles: {
    paddingTop: 19,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  healthContextualDataStyles: {
    paddingBottom: 12,
  },
  scoreStyles: {
    fontSize: theme.fontSizes[5],
    fontWeight: 'bold',
    lineHeight: theme.lineHeights[5],
    letterSpacing: -1.5,
    height: 40,
  },
  healthImageStyle: {
    height: 40,
  },
  contextualDataStyles: {
    fontSize: theme.fontSizes[1],
    color: theme.colors.gray[1],
  },
  classStyles: {
    fontSize: theme.fontSizes[1],
    fontWeight: 'bold',
    lineHeight: theme.lineHeights[4],
    letterSpacing: 0.05,
    textAlign: 'center',
    minHeight: 48,
  },
});

const healthImages = {
  smokingLowRisk: smokingLowRisk,
  smokingHighRisk: smokingHighRisk,
  alcoholLowRisk: alcoholLowRisk,
  alcoholHighRisk: alcoholHighRisk,
  exerciseLowRisk: exerciseLowRisk,
  exerciseHighRisk: exerciseHighRisk,
  sleepHighRisk: sleepHighRisk,
  sleepLowRisk: sleepLowRisk,
  nutritionHighRisk: nutritionHighRisk,
  nutritionLowRisk: nutritionLowRisk,
  nutritionModerateRisk: nutritionModerateRisk,
  mentalHealthHighRisk: mentalHealthHighRisk,
  mentalHealthLowRisk: mentalHealthLowRisk,
  mentalHealthModerateRisk: mentalHealthModerateRisk,
};

const healthIndicatorColor = {
  Healthy: healthIndicatorGreen,
  Overweight: healthIndicatorPurple,
  Obese: healthIndicatorOrange,
  ExtremelyObese: healthIndicatorRed,
  LowRisk: healthIndicatorGreen,
  HighRisk: healthIndicatorOrange,
  VeryHighRisk: healthIndicatorRed,
  smokingLowRisk: healthIndicatorGreen,
  smokingHighRisk: healthIndicatorRed,
  alcoholLowRisk: healthIndicatorGreen,
  alcoholHighRisk: healthIndicatorRed,
  exerciseLowRisk: healthIndicatorGreen,
  exerciseHighRisk: healthIndicatorRed,
  sleepLowRisk: healthIndicatorGreen,
  sleepHighRisk: healthIndicatorRed,
  nutritionHighRisk: healthIndicatorRed,
  nutritionLowRisk: healthIndicatorGreen,
  nutritionModerateRisk: healthIndicatorOrange,
  mentalHealthHighRisk: healthIndicatorRed,
  mentalHealthLowRisk: healthIndicatorGreen,
  mentalHealthModerateRisk: healthIndicatorOrange,
};

const HealthResultCard = ({
  healthLabel,
  healthScore,
  healthClass,
  healthContextualData,
}) => (
  <Card containerStyle={styles.cardStyle}>
    <View style={styles.indicatorStyles}>
      <Image
        source={healthIndicatorColor[healthClass]}
        resizeMode="contain"
        width={18}
        height={18}
      />
      <Text style={styles.labelStyle}>{healthLabel}</Text>
    </View>
    <View style={styles.healthStatusStyles}>
      {healthScore ? (
        <Text style={styles.scoreStyles}>{healthScore}</Text>
      ) : (
        <Image
          style={styles.healthImageStyle}
          source={healthImages[healthClass]}
          resizeMode="contain"
          height={18}
        />
      )}
      <Text style={styles.classStyles}>
        <FormattedMessage id={`health.class.${healthClass}`} />
      </Text>
    </View>
    <View style={styles.healthContextualDataStyles}>
      <Text style={styles.contextualDataStyles}>{healthContextualData}</Text>
    </View>
  </Card>
);

HealthResultCard.propTypes = {
  healthLabel: PropTypes.string.isRequired,
  healthScore: PropTypes.number,
  healthClass: PropTypes.string.isRequired,
  healthContextualData: PropTypes.string.isRequired,
};

export default HealthResultCard;
