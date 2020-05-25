import { renderForTest } from '@testUtils';
import React from 'react';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import ProfileMemberModal from '../ProfileMemberModal';

const navigation = {
  navigate: jest.fn(),
};

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({ type: 'OK' })),
}));

const user = {
  membersMap: {
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
  },
  unterminatedMembersMap: {
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
  },
  membersProfileOrder: ['3', '27', '28'],
};

const benefit = {
  byMemberId: {
    '3': {},
    '27': {},
  },
};

const form = {
  memberForm: {
    values: { selectedMemberId: 0 },
  },
};

const initialState = { user, form, benefit };

describe('ProfileMemberModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const component = renderForTest(
      <ProfileMemberModal navigation={navigation} />,
      {
        initialState,
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should indicate the selected member field', async () => {
    const component = renderForTest(
      <ProfileMemberModal navigation={navigation} />,
      {
        initialState: {
          ...initialState,
          form: { memberForm: { values: { selectedMemberId: '3' } } },
        },
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should navigate back on press', async () => {
    const component = renderForTest(
      <ProfileMemberModal navigation={navigation} />,
      {
        initialState,
      },
    );
    const employeeName = user.membersMap[3].fullName;
    const listItem = component.getByText(employeeName);
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });
});
