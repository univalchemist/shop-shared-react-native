import React from 'react';
import { Text } from '@wrappers/components';
import { useIntl } from '@wrappers/core/hooks';
import HealthScoreLayout from './HealthScoreLayout';

const HealthScoreError = () => {
  const intl = useIntl();
  return (
    <HealthScoreLayout
      score={
        <Text
          paddingTop={24}
          fontSize={48}
          textAlign="center"
          lineHeight={37}
          fontWeight={600}
          color="gray.0"
        >
          {intl.formatMessage({
            id: 'health.healthScore.errorEmptyScore',
          })}
        </Text>
      }
      maxScore={
        <Text
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
      heading={
        <Text fontSize={14} lineHeight={20} textAlign={'center'}>
          {intl.formatMessage({
            id: 'health.healthScore.errorMessage.unableToShow',
          })}
        </Text>
      }
      description={
        <Text fontSize={14} lineHeight={20} textAlign={'center'}>
          {intl.formatMessage({
            id: 'health.healthScore.errorMessage.tryAgain',
          })}
        </Text>
      }
    />
  );
};

export default HealthScoreError;
