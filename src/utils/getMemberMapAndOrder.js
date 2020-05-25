import { IsEmployee, IsDependent } from './roles';
import { IsCategoryChild, IsCategorySpouse } from './relationships';
import { isOnExtendedTime, isTerminatedOrExtended } from './isTerminated';

const getMemberMapAndOrder = memberProfile => {
  if (memberProfile === null || memberProfile === undefined) {
    return {
      membersMap: {},
      membersProfileOrder: [],
      membersBenefitOrder: [],
    };
  }

  let membersMap = {};
  let unterminatedMembersMap = {};
  let memberProfileBreakdown = {
    self: null,
    employeeId: null,
    dependentSpouseIds: [],
    dependentChildIds: [],
  };

  const { relationships, ...self } = memberProfile;

  memberProfileBreakdown.self = self;
  membersMap = { [self.memberId]: self };
  if (
    !(
      isTerminatedOrExtended(self.status) &&
      !isOnExtendedTime(self.limitedAccessUntil)
    )
  ) {
    unterminatedMembersMap = { [self.memberId]: self };
  }

  getBreakdownOfMembers(self, memberProfileBreakdown);

  relationships.forEach(member => {
    membersMap[member.memberId] = member;
    if (
      !(
        isTerminatedOrExtended(member.status) &&
        !isOnExtendedTime(member.limitedAccessUntil)
      )
    ) {
      unterminatedMembersMap[member.memberId] = member;
    }
    getBreakdownOfMembers(member, memberProfileBreakdown);
  });

  return {
    membersMap: membersMap,
    membersProfileOrder: getMembersProfileOrder(memberProfileBreakdown),
    membersBenefitOrder: getMembersBenefitOrder(memberProfileBreakdown),
    unterminatedMembersMap,
  };
};

const getBreakdownOfMembers = (member, memberProfileBreakdown) => {
  if (IsEmployee(member.role)) {
    memberProfileBreakdown.employeeId = member.memberId;
  } else if (
    IsDependent(member.role) &&
    IsCategorySpouse(member.relationshipCategory)
  ) {
    memberProfileBreakdown.dependentSpouseIds.push(member.memberId);
  } else if (
    IsDependent(member.role) &&
    IsCategoryChild(member.relationshipCategory)
  ) {
    memberProfileBreakdown.dependentChildIds.push(member.memberId);
  }
};

const getMembersProfileOrder = memberProfileBreakdown => {
  let membersProfileOrder = [];
  const {
    employeeId,
    dependentSpouseIds,
    dependentChildIds,
  } = memberProfileBreakdown;

  membersProfileOrder.push(employeeId);
  membersProfileOrder = membersProfileOrder.concat(dependentSpouseIds);
  membersProfileOrder = membersProfileOrder.concat(dependentChildIds);
  return membersProfileOrder;
};

const getMembersBenefitOrder = memberProfileBreakdown => {
  let memberBenefitOrder = [];
  const {
    self,
    employeeId,
    dependentSpouseIds,
    dependentChildIds,
  } = memberProfileBreakdown;

  if (IsEmployee(self.role)) {
    memberBenefitOrder.push(self.memberId);
    memberBenefitOrder = memberBenefitOrder.concat(dependentSpouseIds);
    memberBenefitOrder = memberBenefitOrder.concat(dependentChildIds);
  } else if (
    IsDependent(self.role) &&
    IsCategorySpouse(self.relationshipCategory)
  ) {
    var otherSpouseIds = dependentSpouseIds.filter(
      spouseId => spouseId !== self.memberId,
    );
    memberBenefitOrder.push(self.memberId);
    memberBenefitOrder.push(employeeId);
    memberBenefitOrder = memberBenefitOrder.concat(otherSpouseIds);
    memberBenefitOrder = memberBenefitOrder.concat(dependentChildIds);
  } else if (
    IsDependent(self.role) &&
    IsCategoryChild(self.relationshipCategory)
  ) {
    memberBenefitOrder.push(self.memberId);
  }

  return memberBenefitOrder;
};

export default getMemberMapAndOrder;
