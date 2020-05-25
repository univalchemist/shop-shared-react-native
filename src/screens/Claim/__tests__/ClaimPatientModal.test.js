import React from 'react';
import ClaimPatientModal from '../ClaimPatientModal';
import {
  fireEvent,
  flushMicrotasksQueue,
  act,
} from 'react-native-testing-library';
import { change } from 'redux-form';
import { renderForTest, renderWithoutStack } from '../../../testUtils';

jest.mock('redux-form', () => ({
  change: jest.fn(() => ({ type: 'OK' })),
}));

const userWithoutFullname = {
  userId: '3',
  membersProfileOrder: ['3'],
  membersMap: {
    '3': {
      memberId: '3',
      fullName: '',
      relationships: null,
    },
    '1': {
      memberId: '1',
      fullName: '',
      relationships: null,
    },
  },
  unterminatedMembersMap: {
    '3': {
      memberId: '3',
      fullName: '',
      relationships: null,
    },
  },
};

const user = {
  userId: '3',
  membersProfileOrder: ['3', '27', '28'],
  membersMap: {
    '3': {
      memberId: '3',
      fullName: 'William Brown',
    },
    '27': {
      contactNumber: null,
      dateOfBirth: '1990-01-01T00:00:00',
      email: 'cath@test.com',
      externalId: '0000124',
      firstName: 'Catherine Brown',
      fullName: 'Catherine Brown Tan',
      gender: 'Female',
      lastName: 'Tan',
      memberId: '27',
      relationshipToEmployee: 'Spouse',
      role: 'Dependent',
    },
    '28': {
      contactNumber: null,
      dateOfBirth: '1990-01-01T00:00:00',
      email: 'george@test.com',
      externalId: '0000125',
      firstName: 'George Brown',
      fullName: 'George Brown Tan',
      gender: 'Male',
      lastName: 'Tan',
      memberId: '28',
      relationshipToEmployee: 'Child',
      role: 'Dependent',
    },
  },
  unterminatedMembersMap: {
    '3': {
      memberId: '3',
      fullName: 'William Brown',
    },
    '28': {
      contactNumber: null,
      dateOfBirth: '1990-01-01T00:00:00',
      email: 'george@test.com',
      externalId: '0000125',
      firstName: 'George Brown',
      fullName: 'George Brown Tan',
      gender: 'Male',
      lastName: 'Tan',
      memberId: '28',
      relationshipToEmployee: 'Child',
      role: 'Dependent',
    },
  },
};

const form = {
  claimDetailsForm: {
    values: { selectedPatientId: 0 },
  },
};

describe('ClaimPatientModal', () => {
  it('should render correctly', () => {
    const component = renderForTest(<ClaimPatientModal />, {
      initialState: { user, form },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('should return null', () => {
    const component = renderWithoutStack(<ClaimPatientModal />, {
      initialState: { user: userWithoutFullname, form },
    });
    expect(component.toJSON()).toBeNull();
  });

  it('should indicate the selected patient', async () => {
    const component = renderForTest(<ClaimPatientModal />, {
      initialState: {
        user,
        form,
      },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('list item should fire form changes on press', async () => {
    const navigation = { navigate: jest.fn() };
    const component = renderForTest(
      <ClaimPatientModal navigation={navigation} />,
      {
        initialState: {
          user,
          form,
        },
      },
    );
    const listItem = component.getByText(user.membersMap[user.userId].fullName);
    await fireEvent.press(listItem);
    await flushMicrotasksQueue();

    expect(change).toBeCalledWith(
      'claimDetailsForm',
      'selectedPatientId',
      user.userId,
    );

    expect(change).toBeCalledWith(
      'claimDetailsForm',
      'patientName',
      user.membersMap[user.userId].fullName,
    );
  });

  it('list item should navigate back on press', async () => {
    const navigation = { navigate: jest.fn() };
    const component = renderForTest(
      <ClaimPatientModal navigation={navigation} />,
      {
        initialState: {
          user,
          form,
        },
      },
    );
    const listItem = component.getByText(user.membersMap[user.userId].fullName);
    act(() => {
      fireEvent.press(listItem);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toBeCalledTimes(1);
  });

  it('list item should update the form on press', async () => {
    const navigation = { navigate: jest.fn() };
    const component = renderForTest(
      <ClaimPatientModal navigation={navigation} />,
      {
        initialState: {
          user,
          form,
        },
      },
    );
    const listItem = component.getByText(user.membersMap[user.userId].fullName);
    await fireEvent.press(listItem);
    await flushMicrotasksQueue();

    expect(change).toBeCalledWith(
      'claimDetailsForm',
      'patientName',
      user.membersMap[user.userId].fullName,
    );
  });
});
