import { ListPicker } from '@wrappers/components';
import { CLAIM_DETAILS_FORM } from '@routes';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import { useIntl } from '@wrappers/core/hooks';
import { CLAIM_REASON_OTHERS } from './constants';
import { categories } from '@store/analytics/trackingActions';

const ClaimReasonModal = ({
  claimType,
  claimTypeId,
  change,
  claimReason,
  touch,
  untouch,
  navigation,
}) => {
  const intl = useIntl();
  useEffect(() => {
    setTimeout(() => touch('claimReason'), 1000);
  }, []);

  const onPressItem = id => {
    change('claimReason', id);
    if (claimType.reasons.byId[id].code !== CLAIM_REASON_OTHERS) {
      change('diagnosisText', '');
      untouch('diagnosisText');
    }
    navigation.navigate(CLAIM_DETAILS_FORM);
  };

  const { reasons } = claimType;
  const allReasons = claimType.types.byId[claimTypeId].claimReasonIds;
  const data = allReasons
    .map(id => {
      const item = reasons.byId[id];
      return {
        key: id,
        value: item.claimReason,
      };
    })
    .sort((a, b) => a.value.localeCompare(b.value, intl.locale));

  const getActionParams = () => ({
    category: categories.CLAIMS_SUBMISSION,
    action: 'Select diagnosis',
  });

  return (
    <ListPicker
      data={data}
      onPressItem={onPressItem}
      selectedKey={claimReason}
      getActionParams={getActionParams}
    />
  );
};

ClaimReasonModal.propTypes = {
  claimReason: PropTypes.number,
  change: PropTypes.func,
  touch: PropTypes.func,
  untouch: PropTypes.func,
};

const mapStateToProps = ({
  claimType,
  form: {
    claimDetailsForm: {
      values: { claimTypeId, claimReason },
    },
  },
}) => ({ claimType, claimTypeId, claimReason });

const enhance = compose(
  connect(mapStateToProps, null),
  reduxForm({
    form: 'claimDetailsForm',
    destroyOnUnmount: false,
  }),
);

export default enhance(ClaimReasonModal);
