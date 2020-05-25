/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useIntl } from '@wrappers/core/hooks';
import { Box, Text, TrackedButton } from '@wrappers/components';
import { IsCategorySpouse } from '@utils';
import {
  MIN_SPOUSE_AGE,
  MIN_CHILD_AGE,
  MAX_CHILD_AGE,
} from '../utils/AgeRangeDependent';
import { categories } from '@store/analytics/trackingActions';

const InviteButton = ({
  relationshipCategory,
  hasInvalidAgeRange,
  hasLoggedIn,
  onPress,
}) => {
  const intl = useIntl();
  const isDisable = hasInvalidAgeRange || hasLoggedIn;

  return (
    <Box px={4} pt={4} pb={2}>
      <TrackedButton
        secondary
        type="outline"
        disabled={isDisable}
        onPress={onPress}
        title={intl.formatMessage({
          id: 'profile.details.inviteButtonText',
        })}
        actionParams={{
          category: categories.PROFILE_MY_DETAILS,
          action: 'Invite dependents',
        }}
      />
      {isDisable && (
        <DisabledMessage
          relationshipCategory={relationshipCategory}
          hasInvalidAgeRange={hasInvalidAgeRange}
          hasLoggedIn={hasLoggedIn}
        />
      )}
    </Box>
  );
};

const DisabledMessage = ({
  relationshipCategory,
  hasInvalidAgeRange,
  hasLoggedIn,
}) => {
  let message = '';

  if (hasInvalidAgeRange) {
    if (IsCategorySpouse(relationshipCategory)) {
      message = 'profile.details.spouseDependentInvalidAgeRange';
    } else {
      message = 'profile.details.childDependentInvalidAgeRange';
    }
  } else if (hasLoggedIn) {
    message = 'profile.details.dependentAlreadyInvited';
  }

  const values = IsCategorySpouse(relationshipCategory)
    ? { minSpouseAge: MIN_SPOUSE_AGE }
    : {
        minChildAge: MIN_CHILD_AGE,
        maxChildAge: MAX_CHILD_AGE,
      };

  return (
    <Box mt={24}>
      <Text color="gray.1" fontSize={14}>
        <FormattedMessage id={message} values={values} />
      </Text>
    </Box>
  );
};

InviteButton.propTypes = {
  relationshipCategory: PropTypes.string.isRequired,
  hasInvalidAgeRange: PropTypes.bool,
  onPress: PropTypes.func,
};

InviteButton.defaultProps = {
  hasInvalidAgeRange: false,
  onPress: function() {},
};

export default InviteButton;
