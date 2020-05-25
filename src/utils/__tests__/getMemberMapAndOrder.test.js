import getMemberMapAndOrder from '../getMemberMapAndOrder';

const employee = {
  memberId: '1',
  role: 'employee',
  relationshipToEmployee: 'self',
  relationshipCategory: 'self',
};

const dependentSpouse1 = {
  memberId: '2',
  role: 'dependent',
  relationshipToEmployee: 'spouse',
  relationshipCategory: 'spouse',
};

const dependentSpouse2 = {
  memberId: '3',
  role: 'dependent',
  relationshipToEmployee: 'spouse',
  relationshipCategory: 'spouse',
};

const dependentChild1 = {
  memberId: '4',
  role: 'dependent',
  relationshipToEmployee: 'child',
  relationshipCategory: 'child',
};

const dependentChild2 = {
  memberId: '5',
  role: 'dependent',
  relationshipToEmployee: 'child',
  relationshipCategory: 'child',
};

describe('getMemberMapAndOrder', () => {
  it('should return empty memberMap and order when memberProfile is null', async () => {
    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(null);

    expect(membersMap).toStrictEqual({});
    expect(membersProfileOrder).toStrictEqual([]);
    expect(membersBenefitOrder).toStrictEqual([]);
  });

  it('should return empty memberMap and order when memberProfile is undefinied', async () => {
    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(undefined);

    expect(membersMap).toStrictEqual({});
    expect(membersProfileOrder).toStrictEqual([]);
    expect(membersBenefitOrder).toStrictEqual([]);
  });

  it('should return valid memberMap and order for employee with no dependents', async () => {
    var memberProfile = {
      ...employee,
      relationships: [],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({ '1': employee });
    expect(membersProfileOrder).toStrictEqual([employee.memberId]);
    expect(membersBenefitOrder).toStrictEqual([employee.memberId]);
  });

  it('should return valid memberMap and order for employee with dependents', async () => {
    var memberProfile = {
      ...employee,
      relationships: [
        dependentSpouse1,
        dependentChild1,
        dependentSpouse2,
        dependentChild2,
      ],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({
      '1': employee,
      '2': dependentSpouse1,
      '4': dependentChild1,
      '3': dependentSpouse2,
      '5': dependentChild2,
    });
    expect(membersProfileOrder).toStrictEqual([
      employee.memberId,
      dependentSpouse1.memberId,
      dependentSpouse2.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
    ]);
    expect(membersBenefitOrder).toStrictEqual([
      employee.memberId,
      dependentSpouse1.memberId,
      dependentSpouse2.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
    ]);
  });

  it('should return valid memberMap and order for spouse dependents with employee', async () => {
    var memberProfile = {
      ...dependentSpouse1,
      relationships: [employee],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({
      '1': employee,
      '2': dependentSpouse1,
    });
    expect(membersProfileOrder).toStrictEqual([
      employee.memberId,
      dependentSpouse1.memberId,
    ]);
    expect(membersBenefitOrder).toStrictEqual([
      dependentSpouse1.memberId,
      employee.memberId,
    ]);
  });

  it('should return valid memberMap and order for spouse dependents with employee and dependents', async () => {
    var memberProfile = {
      ...dependentSpouse1,
      relationships: [dependentChild1, employee, dependentChild2],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({
      '1': employee,
      '2': dependentSpouse1,
      '4': dependentChild1,
      '5': dependentChild2,
    });
    expect(membersProfileOrder).toStrictEqual([
      employee.memberId,
      dependentSpouse1.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
    ]);
    expect(membersBenefitOrder).toStrictEqual([
      dependentSpouse1.memberId,
      employee.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
    ]);
  });

  it('should return valid memberMap and order for child dependents with employee', async () => {
    var memberProfile = {
      ...dependentChild1,
      relationships: [employee],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({
      '1': employee,
      '4': dependentChild1,
    });
    expect(membersProfileOrder).toStrictEqual([
      employee.memberId,
      dependentChild1.memberId,
    ]);
    expect(membersBenefitOrder).toStrictEqual([dependentChild1.memberId]);
  });

  it('should return valid memberMap and order for child dependents with employee and dependents', async () => {
    var memberProfile = {
      ...dependentChild1,
      relationships: [
        dependentSpouse2,
        dependentChild2,
        employee,
        dependentSpouse1,
      ],
    };

    const {
      membersMap,
      membersProfileOrder,
      membersBenefitOrder,
    } = getMemberMapAndOrder(memberProfile);

    expect(membersMap).toStrictEqual({
      '1': employee,
      '2': dependentSpouse1,
      '3': dependentSpouse2,
      '4': dependentChild1,
      '5': dependentChild2,
    });
    expect(membersProfileOrder).toStrictEqual([
      employee.memberId,
      dependentSpouse2.memberId,
      dependentSpouse1.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
    ]);
    expect(membersBenefitOrder).toStrictEqual([dependentChild1.memberId]);
  });
});
