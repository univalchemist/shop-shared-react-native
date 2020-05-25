import { IsEmployee } from '@utils';
// import { editIcon, addIcon } from '@images';

const PREFIX = 'profile.details';
const fullName = 'fullName';
const workEmail = 'workEmail';
const relationshipToEmployee = 'relationshipToEmployee';
const personalEmail = 'email';
const mobileNumber = 'contactNumber';

const SELF_EMPLOYEE_PROPERTY = [
  fullName,
  workEmail,
  personalEmail,
  mobileNumber,
];

const SELF_DEPENDANT_PROPERTY = [
  fullName,
  relationshipToEmployee,
  personalEmail,
  mobileNumber,
];

const OTHER_EMPLOYEE_PROPERTY = [fullName, workEmail];

const OTHER_DEPENDANT_PROPERTY = [fullName, relationshipToEmployee];

const getLocalizedData = (intl, user) => member => {
  const localizedData = [];
  const fillData = arrProps => {
    for (let memberProp of arrProps) {
      const data = {
        label: intl.formatMessage({
          id: `${PREFIX}.${memberProp}Title`,
        }),
        value:
          member[memberProp] ||
          ((memberProp === mobileNumber || memberProp === personalEmail) &&
            '-'),
      };

      if (memberProp === personalEmail && user.userId === member.memberId) {
        data.rightIcon = {
          // source: member[memberProp] ? editIcon : addIcon,
          // navigateTo: PROFILE_CHANGE_EMAIL_SCREEN,
        };
      }

      if (data.value) {
        localizedData.push(data);
      }
    }
  };

  if (IsEmployee(user.role)) {
    if (user.userId === member.memberId) {
      fillData(SELF_EMPLOYEE_PROPERTY);
    } else {
      fillData(SELF_DEPENDANT_PROPERTY);
    }
  } else {
    if (user.userId === member.memberId) {
      fillData(SELF_DEPENDANT_PROPERTY);
    } else if (IsEmployee(member.role)) {
      fillData(OTHER_EMPLOYEE_PROPERTY);
    } else {
      fillData(OTHER_DEPENDANT_PROPERTY);
    }
  }

  return {
    title: intl.formatMessage({
      id: IsEmployee(member.role)
        ? 'profile.details.mainPolicyHolderTitle'
        : 'profile.details.dependentTitle',
    }),
    member,
    data: localizedData,
  };
};

export default getLocalizedData;
