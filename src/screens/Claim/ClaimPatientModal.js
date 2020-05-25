import React from 'react';
import { connect } from 'react-redux';
import { ListPicker } from '@wrappers/components';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import { CLAIM_PATIENT_DETAILS } from '@routes';
import { categories } from '@store/analytics/trackingActions';

const ClaimPatientModal = ({
  change,
  userId,
  membersProfileOrder,
  unterminatedMembersMap,
  selectedPatientId,
  navigation,
}) => {
  if (!unterminatedMembersMap[userId].fullName) {
    return <></>;
  }
  const onPressItem = memberId => {
    const selectedItem = unterminatedMembersMap[memberId];
    change('claimDetailsForm', 'patientName', selectedItem.fullName);
    change('claimDetailsForm', 'selectedPatientId', memberId);
    navigation.navigate(CLAIM_PATIENT_DETAILS);
  };

  const data = membersProfileOrder
    .map(memberId => {
      const member = unterminatedMembersMap[memberId];
      if (!member) return null;
      return {
        key: memberId,
        value: member.fullName,
      };
    })
    .filter(item => !!item);

  const getActionParams = () => ({
    category: categories.CLAIMS_SUBMISSION,
    action: 'Select patient name',
  });

  return (
    <ListPicker
      data={data}
      onPressItem={onPressItem}
      selectedKey={selectedPatientId}
      getActionParams={getActionParams}
    />
  );
};

ClaimPatientModal.propTypes = {
  unterminatedMembersMap: PropTypes.shape({}),
  membersProfileOrder: PropTypes.array,
  selectedPatientId: PropTypes.string,
  change: PropTypes.func,
};

const mapStateToProps = ({
  user: { userId, membersProfileOrder, unterminatedMembersMap },
  form: {
    claimDetailsForm: { values },
  },
}) => ({
  userId,
  membersProfileOrder,
  unterminatedMembersMap,
  selectedPatientId: values?.selectedPatientId,
});

export default connect(mapStateToProps, { change })(ClaimPatientModal);
