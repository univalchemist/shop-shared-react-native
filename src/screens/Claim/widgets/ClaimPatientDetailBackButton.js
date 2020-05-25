import React from 'react';
import { injectIntl } from 'react-intl';
import { TouchableOpacity, Alert } from 'react-native';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import { StackBackButton } from '@wrappers/components';

export const handlePress = (navigation, intl, reset) => {
  Alert.alert(
    intl.formatMessage({ id: 'leaveThisPage' }),
    intl.formatMessage({ id: 'claim.submitResetWarning' }),
    [
      {
        text: intl.formatMessage({ id: 'stay' }),
        style: 'cancel',
        onPress: () => {},
      },
      {
        text: intl.formatMessage({ id: 'leave' }),
        onPress: () => {
          navigation.goBack();
          reset('claimDetailsForm');
        },
      },
    ],
    { cancelable: false, onDismiss: () => {} },
  );
};

const ClaimPatientDetailBackButton = ({ intl, reset, navigation }) => {
  return (
    <TouchableOpacity onPress={() => handlePress(navigation, intl, reset)}>
      <StackBackButton style={{ paddingLeft: 15 }} />
    </TouchableOpacity>
  );
};

ClaimPatientDetailBackButton.propTypes = {
  reset: PropTypes.func,
};

const enhance = compose(connect(null, { reset }), injectIntl);

export default enhance(ClaimPatientDetailBackButton);
