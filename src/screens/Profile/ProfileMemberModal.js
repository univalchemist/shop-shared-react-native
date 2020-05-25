import React from 'react';
import { connect } from 'react-redux';
import { ListPicker } from '@wrappers/components';
import PropTypes from 'prop-types';
import { change } from 'redux-form';
import { PROFILE_MY_BENEFITS } from '@routes';
import { categories } from '@store/analytics/trackingActions';

const ProfileMemberModal = ({
  change,
  membersProfileOrder,
  unterminatedMembersMap,
  selectedMemberId,
  navigation,
}) => {
  if (!Object.keys(unterminatedMembersMap).length) return null;
  const onPressItem = id => {
    const selectedMember = unterminatedMembersMap[id];
    change('memberForm', 'memberName', selectedMember.fullName);
    change('memberForm', 'selectedMemberId', id);
    navigation.navigate(PROFILE_MY_BENEFITS);
  };

  const data = membersProfileOrder
    .map(memberId => {
      if (!unterminatedMembersMap[memberId]) return null;
      return {
        key: memberId,
        value: unterminatedMembersMap[memberId].fullName,
        role: unterminatedMembersMap[memberId].role,
      };
    })
    .filter(item => !!item);

  return (
    <ListPicker
      data={data}
      onPressItem={onPressItem}
      selectedKey={selectedMemberId.toString()}
      getActionParams={item => {
        return {
          category: categories.PROFILE_BENEFITS_SUMMARY,
          action: `View ${item.role} benefit`,
        };
      }}
    />
  );
};

ProfileMemberModal.propTypes = {
  member: PropTypes.shape({
    dependentsMap: PropTypes.shape({}),
    employee: PropTypes.shape({}),
  }),
  benefit: PropTypes.shape({ byMemberId: PropTypes.shape({}) }),
  change: PropTypes.func,
  unterminatedMembersMap: PropTypes.shape({}),
};

const mapStateToProps = ({
  user: { membersProfileOrder, unterminatedMembersMap },
  form: {
    memberForm: { values },
  },
}) => ({
  membersProfileOrder,
  unterminatedMembersMap,
  selectedMemberId: values?.selectedMemberId,
});

export default connect(mapStateToProps, { change })(ProfileMemberModal);
