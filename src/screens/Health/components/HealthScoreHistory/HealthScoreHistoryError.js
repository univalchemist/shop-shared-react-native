import React from 'react';
import { Text } from '@wrappers/components';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

const HealthScoreHistoryError = ({ intl }) => {
  return (
    <>
      <Text
        accessible={true}
        accessibilityLabel={intl.formatMessage({
          id: 'health.healthScoreHistory.errorMessage.unableToShow',
        })}
        fontSize={14}
        lineHeight={20}
        textAlign={'center'}
      >
        {intl.formatMessage({
          id: 'health.healthScoreHistory.errorMessage.unableToShow',
        })}
      </Text>
      <Text
        accessible={true}
        accessibilityLabel={intl.formatMessage({
          id: 'health.healthScoreHistory.errorMessage.tryAgain',
        })}
        fontSize={14}
        lineHeight={20}
        textAlign={'center'}
      >
        {intl.formatMessage({
          id: 'health.healthScoreHistory.errorMessage.tryAgain',
        })}
      </Text>
    </>
  );
};

const enhance = compose(injectIntl);
export default enhance(HealthScoreHistoryError);
