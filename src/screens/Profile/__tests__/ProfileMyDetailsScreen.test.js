import React from 'react';
import { renderForTestWithStore } from '@testUtils';
import { PROFILE_DEPENDENT_INVITE } from '@routes';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import ProfileMyDetailsScreen from '../ProfileMyDetailsScreen';
import {
  SectionLabelValueListSkeletonPlaceholder,
  ErrorPanel,
  Button,
} from '@wrappers/components';

jest.mock('react-native-config', () => ({
  MIN_SPOUSE_AGE: '18',
  MIN_CHILD_AGE: '18',
  MAX_CHILD_AGE: '23',
}));

const employee = {
  memberId: '3',
  fullName: 'William Brown',
  email: 'william@abc.com',
  workEmail: 'employee@mail.com',
  role: 'Employee',
  relationshipToEmployee: 'Self',
  relationshipCategory: 'Self',
  hasLoggedIn: true,
};

const dependentSpouse = {
  memberId: '27',
  fullName: 'Catherine Brown',
  email: 'cath@test.com',
  workEmail: null,
  role: 'Dependent',
  relationshipToEmployee: 'Spouse',
  relationshipCategory: 'Spouse',
  dateOfBirth: '2000',
  validAgeRange: false,
  hasLoggedIn: false,
};

const dependentChild1 = {
  memberId: '28',
  fullName: 'George Brown Tan',
  email: 'george@test.com',
  workEmail: null,
  role: 'Dependent',
  relationshipToEmployee: 'Child',
  relationshipCategory: 'Child',
  dateOfBirth: '2000',
  validAgeRange: false,
  hasLoggedIn: false,
};

const dependentChild2 = {
  memberId: '29',
  fullName: 'Charlotte Brown Tan',
  email: 'cath@test.com',
  workEmail: null,
  role: 'Dependent',
  relationshipToEmployee: 'Child',
  relationshipCategory: 'Child',
  dateOfBirth: null,
  validAgeRange: false,
  hasLoggedIn: false,
};

const dependentChild3 = {
  memberId: '30',
  fullName: 'Dash Tan',
  email: 'dash@test.com',
  workEmail: null,
  role: 'Dependent',
  relationshipToEmployee: 'Child',
  relationshipCategory: 'Child',
  dateOfBirth: '2000',
  validAgeRange: true,
  hasLoggedIn: true,
};

const initialState = {
  user: {
    data: {
      clientId: 'cxadevclient1',
      userId: 'userId',
    },
    userId: '3',
    role: 'Employee',
    membersMap: {
      [employee.memberId]: employee,
      [dependentSpouse.memberId]: dependentSpouse,
      [dependentChild1.memberId]: dependentChild1,
      [dependentChild2.memberId]: dependentChild2,
      [dependentChild3.memberId]: dependentChild3,
    },
    membersProfileOrder: [
      employee.memberId,
      dependentSpouse.memberId,
      dependentChild1.memberId,
      dependentChild2.memberId,
      dependentChild3.memberId,
    ],
  },
};

const benefitContent = {
  member: {
    memberId: '3',
  },
  relationships: [
    {
      memberId: '27',
    },
    {
      memberId: '28',
    },
    {
      memberId: '29',
    },
    {
      memberId: '30',
    },
  ],
  package: {
    plans: [],
  },
};

const getMemberProfileContent = {
  memberId: '3',
  fullName: 'William Brown',
  email: 'william@abc.com',
  workEmail: 'employee@mail.com',
  role: 'Employee',
  relationshipToEmployee: 'Self',
  hasLoggedIn: true,
  relationships: [
    dependentSpouse,
    dependentChild1,
    dependentChild2,
    dependentChild3,
  ],
};

const api = {
  fetchBenefits: jest.fn(() => {
    return Promise.resolve({ data: { ...benefitContent } });
  }),
  fetchMemberProfile: jest.fn(() => {
    return Promise.resolve({ data: { ...getMemberProfileContent } });
  }),
};

describe('ProfileMyDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render skeleton loader when isLoading', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={{}} />,
      {
        initialState,
        api,
      },
    );
    expect(
      Component.getAllByType(SectionLabelValueListSkeletonPlaceholder).length,
    ).toEqual(1);
    await flushMicrotasksQueue();
    expect(
      Component.queryByType(SectionLabelValueListSkeletonPlaceholder),
    ).toBeNull();
  });

  it('should render error page when error encountered for fetch benefits', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={{}} />,
      {
        initialState,
        api: {
          fetchBenefits: jest.fn(() => Promise.reject()),
        },
      },
    );
    await flushMicrotasksQueue();
    expect(Component.getAllByType(ErrorPanel).length).toEqual(1);
  });

  it('should display Employee details when data successfully loads', async () => {
    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={{}} isEmployeeUser={true} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    // expect(api.fetchBenefits).toHaveBeenCalled();
    expect(api.fetchMemberProfile).toHaveBeenCalled();
    expect(Component.getByText('Main policyholder')).toBeDefined();
    expect(Component.getByText('William Brown')).toBeDefined();
    // expect(Component.getByText('0000123')).toBeDefined();
    expect(Component.getByText('employee@mail.com')).toBeDefined();
  });

  it.skip('should navigate and update selected dependent member id when employee clicks on invite dependent', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={navigation} />,
      {
        initialState,
        api,
      },
    );

    await flushMicrotasksQueue();
    var inviteButtons = Component.getAllByType(Button);
    await fireEvent.press(inviteButtons[0]);

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith(PROFILE_DEPENDENT_INVITE, {
      dependent: {
        email: 'cath@test.com',
        workEmail: null,
        fullName: 'Catherine Brown',
        memberId: '27',
        relationshipToEmployee: 'Spouse',
        relationshipCategory: 'Spouse',
        role: 'Dependent',
        dateOfBirth: '2000',
        validAgeRange: false,
        hasLoggedIn: false,
      },
    });
  });

  it.skip('should disable invite button with warning if date of birth defined and validAgeRange is false for dependent spouse', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const customMemberProfileContent = {
      ...getMemberProfileContent,
      relationships: [dependentSpouse],
    };

    const customApi = {
      ...api,
      fetchMemberProfile: jest.fn(() => {
        return Promise.resolve({ data: { ...customMemberProfileContent } });
      }),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={navigation} />,
      {
        initialState: {
          user: {
            ...initialState.user,
          },
        },
        api: customApi,
      },
    );

    await flushMicrotasksQueue();
    var inviteButton = Component.getByType(Button);
    var expectedHint =
      'Your spouse / partner / civil partner must be 18 years old and above to access the dependent app and website for HSBC Benefits';

    expect(inviteButton.props.disabled).toEqual(true);
    expect(Component.getByText(expectedHint)).toBeDefined();
  });

  it.skip('should disable invite button with warning if date of birth defined and validAgeRange is false for dependent child', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const customMemberProfileContent = {
      ...getMemberProfileContent,
      relationships: [dependentChild1],
    };

    const customApi = {
      ...api,
      fetchMemberProfile: jest.fn(() => {
        return Promise.resolve({ data: { ...customMemberProfileContent } });
      }),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={navigation} />,
      {
        initialState: {
          user: {
            ...initialState.user,
          },
        },
        api: customApi,
      },
    );

    await flushMicrotasksQueue();
    var inviteButton = Component.getByType(Button);
    var expectedHint =
      'Your child / step child must be 18-23 years old to access the dependent app and website for HSBC Benefits';

    expect(inviteButton.props.disabled).toEqual(true);
    expect(Component.getByText(expectedHint)).toBeDefined();
  });

  it.skip('should enable invite button with warning if date of birth is null and validAgeRange is false for dependent', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const customMemberProfileContent = {
      ...getMemberProfileContent,
      relationships: [dependentChild2],
    };

    const customApi = {
      ...api,
      fetchMemberProfile: jest.fn(() => {
        return Promise.resolve({ data: { ...customMemberProfileContent } });
      }),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={navigation} />,
      {
        initialState: {
          user: {
            ...initialState.user,
          },
        },
        api: customApi,
      },
    );

    await flushMicrotasksQueue();
    var inviteButton = Component.getByType(Button);
    expect(inviteButton.props.disabled).toEqual(false);
  });

  it.skip('should disable invite button with warning if date of birth and validAgeRange is true, but dependent has already logged in', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const customMemberProfileContent = {
      ...getMemberProfileContent,
      relationships: [dependentChild3],
    };

    const customApi = {
      ...api,
      fetchMemberProfile: jest.fn(() => {
        return Promise.resolve({ data: { ...customMemberProfileContent } });
      }),
    };

    const [Component] = renderForTestWithStore(
      <ProfileMyDetailsScreen navigation={navigation} />,
      {
        initialState: {
          user: {
            ...initialState.user,
          },
        },
        api: customApi,
      },
    );

    await flushMicrotasksQueue();
    var inviteButton = Component.getByType(Button);
    var expectedHint = 'You have successfully invited him/her.';

    expect(inviteButton.props.disabled).toEqual(true);
    expect(Component.getByText(expectedHint)).toBeDefined();
  });
});
