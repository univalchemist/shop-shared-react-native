import { IsEmployee, isTerminatedOrExtended, isOnExtendedTime } from '@utils';

export const remainsTopTitleOnly = (prevTitle = '') => (acc, member) => {
  const nextMember = { ...member };

  if (prevTitle === member.title) {
    nextMember.title = null;
  }

  prevTitle = member.title;

  return [...acc, nextMember];
};

export const withMembershipNumber = ({ membersMap, byMemberId = {} }) => {
  return (acc, memberId) => {
    const member = membersMap[memberId];
    const memberWithMN = {
      ...member,
      membershipNumber: byMemberId[memberId]?.membershipNumber,
    };

    if (IsEmployee(member.role)) {
      return {
        ...acc,
        employee: memberWithMN,
      };
    }

    return {
      ...acc,
      dependents: [...acc.dependents, memberWithMN],
    };
  };
};

export const withUnterminatedMembershipNumber = ({
  membersMap,
  byMemberId = {},
}) => {
  return (acc, memberId) => {
    const member = membersMap[memberId];
    const memberWithMN = {
      ...member,
      membershipNumber: byMemberId[memberId]?.membershipNumber,
    };

    if (IsEmployee(member.role)) {
      return {
        ...acc,
        employee: memberWithMN,
      };
    }
    const unterminatedDependents = [...acc.dependents, memberWithMN].filter(
      item =>
        !(
          isTerminatedOrExtended(item.status) &&
          !isOnExtendedTime(item.limitedAccessUntil)
        ),
    );

    return {
      ...acc,
      dependents: unterminatedDependents,
    };
  };
};
