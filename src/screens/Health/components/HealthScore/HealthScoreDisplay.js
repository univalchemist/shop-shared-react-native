import React from 'react';
import { Text, Box, TextSkeletonPlaceholder } from '@wrappers/components';
import { useTheme, useIntl } from '@wrappers/core/hooks';
import HealthScoreLayout from './HealthScoreLayout';

const HealthScoreLoading = () => {
  return (
    <HealthScoreLayout
      isLoading
      heading={<TextSkeletonPlaceholder width={120} />}
      description={
        <>
          <Box mt={1}>
            <TextSkeletonPlaceholder
              fontSize={16}
              lineHeight={20}
              width={200}
            />
          </Box>
          <Box mt={1}>
            <TextSkeletonPlaceholder
              fontSize={16}
              lineHeight={20}
              width={200}
            />
          </Box>
        </>
      }
      score={
        <TextSkeletonPlaceholder fontSize={48} lineHeight={48} width={58} />
      }
      maxScore={
        <Box mt={1}>
          <TextSkeletonPlaceholder fontSize={16} lineHeight={16} width={80} />
        </Box>
      }
    />
  );
};

const HealthScoreDisplay = ({ score }) => {
  const intl = useIntl();
  const theme = useTheme();
  const displayScore = Math.round(score);

  const leftFill =
    displayScore >= 0 && displayScore <= 25
      ? theme.healthScoreGraphicColors.lowScore
      : undefined;
  const topFill =
    displayScore > 25 && displayScore <= 75
      ? theme.healthScoreGraphicColors.averageScore
      : undefined;
  const rightFill =
    displayScore > 75 && displayScore <= 100
      ? theme.healthScoreGraphicColors.highScore
      : undefined;

  return (
    <HealthScoreLayout
      heading={
        <Text
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.healthScore.heading',
          })}
          color={theme.colors.gray[0]}
          textAlign="center"
        >
          {intl.formatMessage({
            id: 'health.healthScore.heading',
          })}
        </Text>
      }
      description={
        <Text
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.healthScore.scoreDescription',
          })}
          fontSize={14}
          lineHeight={20}
          textAlign="center"
        >
          {intl.formatMessage({ id: 'health.healthScore.scoreDescription' })}
        </Text>
      }
      leftFill={leftFill}
      topFill={topFill}
      rightFill={rightFill}
      score={
        <Text
          accessible={true}
          accessibilityLabel={displayScore ? displayScore.toString() : ''}
          paddingTop={24}
          fontSize={48}
          textAlign="center"
          lineHeight={37}
          fontWeight={600}
          color="fonts.blackLink"
        >
          {displayScore}
        </Text>
      }
      maxScore={
        <Text
          accessible={true}
          accessibilityLabel={intl.formatMessage({
            id: 'health.healthScore.maximumScoreDisplay',
          })}
          fontSize={12}
          lineHeight={16}
          fontWeight={600}
          letterSpacing={1.6}
          textAlign="center"
        >
          {intl.formatMessage({
            id: 'health.healthScore.maximumScoreDisplay',
          })}
        </Text>
      }
    />
  );
};

export { HealthScoreLoading };
export default HealthScoreDisplay;
