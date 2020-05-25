import { withMembershipNumber } from '../helpers';

describe('withMembershipNumber', () => {
  it('should return member map with membership number', () => {
    const membersMap = {
      3: {
        fullName: 'testfullname 3',
        role: 'Employee',
        relationshipToEmployee: 'Self',
      },
      27: {
        fullName: 'testdep fullname 27',
        role: 'Dependent',
        relationshipToEmployee: 'Spouse',
      },
      28: {
        fullName: 'testdep fullname 28',
        role: 'Dependent',
        relationshipToEmployee: 'Child',
      },
    };
    const acc = {
      dependents: [
        {
          fullName: 'testdep fullname 28',
          role: 'Dependent',
          relationshipToEmployee: 'Child',
        },
      ],
    };

    const expectedResult = {
      dependents: [
        {
          fullName: 'testdep fullname 28',
          role: 'Dependent',
          relationshipToEmployee: 'Child',
        },
      ],
      employee: {
        fullName: 'testfullname 3',
        role: 'Employee',
        relationshipToEmployee: 'Self',
        membershipNumber: undefined,
      },
    };

    expect(
      withMembershipNumber({
        membersMap,
      })(acc, 3),
    ).toEqual(expectedResult);
  });

  it('should return members map if user is not employee', () => {
    const membersMap = {
      3: {
        fullName: 'testfullname 3',
        role: 'Employee',
        relationshipToEmployee: 'Self',
      },
      27: {
        fullName: 'testdep fullname 27',
        role: 'Dependent',
        relationshipToEmployee: 'Spouse',
      },
      28: {
        fullName: 'testdep fullname 28',
        role: 'Dependent',
        relationshipToEmployee: 'Child',
      },
    };
    const acc = {
      dependents: [
        {
          fullName: 'testdep fullname 28',
          role: 'Dependent',
          relationshipToEmployee: 'Child',
        },
      ],
    };

    const expectedResult = {
      dependents: [
        {
          fullName: 'testdep fullname 28',
          role: 'Dependent',
          relationshipToEmployee: 'Child',
        },
        {
          fullName: 'testdep fullname 27',
          role: 'Dependent',
          relationshipToEmployee: 'Spouse',
        },
      ],
    };

    expect(
      withMembershipNumber({
        membersMap,
      })(acc, 27),
    ).toEqual(expectedResult);
  });
});
