import React from 'react';
import PropTypes from 'prop-types';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import { PROFILE_DEPENDENT_INVITE } from '@routes';
import { fetchBenefits } from '@store/benefit/actions';
import { getMemberProfile } from '@store/user/actions';
import {
  Box,
  ListItem,
  LabelValueText,
  ErrorPanel,
  SectionHeadingText,
  SectionLabelValueListSkeletonPlaceholder,
} from '@wrappers/components';
import { useIntl, useFetchActions } from '@wrappers/core/hooks';
import { IsEmployee, IsDependent, isTerminatedOrExtended } from '@utils';
import {
  withUnterminatedMembershipNumber,
  remainsTopTitleOnly,
} from './helpers';
import getLocalizedData from './getLocalizedData';
import InviteButton from '../widgets/InviteButton';

const ProfileMyDetailsEmployeeScreen = ({
  user,
  getMembersData,
  fetchBenefits,
  getMemberProfile,
  onPressInvite,
  isUserTerminatedOrExtended,
}) => {
  const isEmployeeUser = IsEmployee(user.role);
  const intl = useIntl();
  const sections = getMembersData(getLocalizedData(intl, user));
  // TODO: uncomment when Benefits service ready
  // const [isLoading, isError] = useFetchActions(
  //   isEmployeeUser ? [fetchBenefits, getMemberProfile] : [fetchBenefits],
  // );

  const [isLoading, isError] = useFetchActions([getMemberProfile]);

  return (
    <Box backgroundColor="gray.7" flex={1}>
      {isLoading ? (
        <SectionLabelValueListSkeletonPlaceholder count={3} />
      ) : isError ? (
        <ErrorPanel />
      ) : (
        <SectionList
          sections={sections}
          stickySectionHeadersEnabled
          keyExtractor={(item, index) => `${index}${item.label}`}
          renderSectionHeader={({ section }) => (
            <Box backgroundColor="gray.7" px={4} pt={4} pb={2}>
              <SectionHeadingText>{section.title}</SectionHeadingText>
            </Box>
          )}
          renderItem={({ item }) => (
            <ListItem>
              <LabelValueText label={item.label}>{item.value}</LabelValueText>
            </ListItem>
          )}
          renderSectionFooter={({ section: { member } }) => {
            const shouldRender =
              isEmployeeUser &&
              IsDependent(member.role) &&
              !isTerminatedOrExtended(member.status);
            let hasInvalidAgeRange = false;

            if (IsDependent(member.role)) {
              hasInvalidAgeRange =
                member.dateOfBirth != null && !member.validAgeRange;
            }

            return (
              shouldRender && (
                <InviteButton
                  hasInvalidAgeRange={hasInvalidAgeRange}
                  hasLoggedIn={member.hasLoggedIn}
                  relationshipCategory={member.relationshipCategory}
                  onPress={() => onPressInvite(member)}
                />
              )
            );
          }}
        />
      )}
    </Box>
  );
};

ProfileMyDetailsEmployeeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  isEmployeeUser: PropTypes.bool,
  fetchBenefits: PropTypes.func.isRequired,
  getMembersData: PropTypes.func.isRequired,
  onPressInvite: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { user, benefit } = state;
  const { navigation } = ownProps;
  const applyMembershipNumber = withUnterminatedMembershipNumber({
    membersMap: user.membersMap,
    byMemberId: benefit.byMemberId,
  });
  return {
    user,
    getMembersData: applyLocaization => {
      const { employee, dependents } = user.membersProfileOrder.reduce(
        applyMembershipNumber,
        {
          employee: {},
          dependents: [],
        },
      );
      return [employee, ...dependents]
        .map(applyLocaization)
        .reduce(remainsTopTitleOnly(), []);
    },
    onPressInvite: dependent => {
      navigation.navigate(PROFILE_DEPENDENT_INVITE, {
        dependent,
      });
    },
    isUserTerminatedOrExtended: isTerminatedOrExtended(user.status),
  };
};

const mapDispatchToProps = {
  getMemberProfile,
  fetchBenefits,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileMyDetailsEmployeeScreen);
