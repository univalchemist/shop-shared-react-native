import React from 'react';
import { renderForTest, renderForTestWithStore } from '@testUtils';
import { Alert, TextInput } from 'react-native';
import messages from '@messages/en-HK.json';
import { Button } from '@wrappers/components';
import { InputField, SelectField } from '@wrappers/components/FinalForm';
import ProfileDependentInviteScreen from '../ProfileDependentInviteScreen';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';

jest.mock('react-native-config', () => ({
  MIN_SPOUSE_AGE: '18',
  MIN_CHILD_AGE: '18',
  MAX_CHILD_AGE: '23',
}));

jest.mock('react-native-modal-datetime-picker', () => {
  const { View } = require('react-native');
  return View;
});
jest.mock('react-native/Libraries/Alert/Alert', () => ({ alert: jest.fn() }));
jest.useFakeTimers();

const apiWithSendInviteError = {
  updateDependentDoB: jest.fn(() => {
    return Promise.resolve();
  }),
  sendInvitationToDependent: jest.fn(() => {
    return Promise.reject();
  }),
};

const apiWithSendInviteEmailAlreadyInUseError = {
  updateDependentDoB: jest.fn(() => {
    return Promise.resolve();
  }),
  sendInvitationToDependent: jest.fn(() => {
    return Promise.reject({
      response: {
        data: {
          errors: [{ messageKey: 'EmailAlreadyTaken' }],
        },
      },
    });
  }),
};

const api = {
  updateDependentDoB: jest.fn(() => {
    return Promise.resolve();
  }),
  sendInvitationToDependent: jest.fn(() => {
    return Promise.resolve();
  }),
};

const initialState = {
  user: {
    data: {
      clientId: 'cxadevclient1',
      userId: '11',
    },
    membersMap: {
      '1': {
        email: 'dependent1@mail.com',
        fullName: 'Dependent 1',
        memberId: '1',
        relationshipCategory: 'Spouse',
        dateOfBirth: '1990-09-17T00:00:00',
        role: 'Dependent',
      },
      '2': {
        email: 'dependent2@mail.com',
        fullName: 'Dependent 2',
        memberId: '2',
        relationshipCategory: 'Spouse',
        dateOfBirth: '2010-09-17T00:00:00',
        role: 'Dependent',
      },
    },
  },
};

describe('ProfileDependentInviteScreenPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should display instructions to user', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          fullName: 'Samantha Tan',
        },
      },
    };
    const { getByText } = renderForTest(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
      },
    );
    const expectedText =
      'Invite dependents to HSBC Benefits so they can access the dependent app and website.';
    const expectedText2 = /Provide Samantha Tan’s email address/;

    expect(getByText(expectedText)).toBeDefined();
    expect(getByText(expectedText2)).toBeDefined();
  });

  it('should contain two input field and submit button', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          fullName: 'Samantha Tan',
        },
      },
    };
    const { getByText, getByType, getAllByType } = renderForTest(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
      },
    );

    expect(getByType(Button)).toBeDefined();
    expect(getByText('Send invite')).toBeDefined();
    expect(getAllByType(InputField).length).toEqual(2);
  });

  it('should validate if email is not filled or invalid email', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          fullName: 'Samantha Tan',
        },
      },
    };
    const { getByProps } = renderForTest(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
      },
    );

    const emailInput = getByProps({ name: 'dependentEmail' });
    const [requiredValidator, validEmailValidator] = emailInput.props.validate;

    expect(requiredValidator('')).toEqual('isRequired');
    expect(validEmailValidator('')).toEqual('invalidEmail');
  });

  it('should display error if email is not matching', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          fullName: 'Samantha Tan',
        },
      },
    };
    const { getAllByType, getByText } = renderForTest(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
      },
    );

    const inputs = getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'c@b.com');
    fireEvent(confirmEmailInput, 'blur');

    await flushMicrotasksQueue();

    const errorMessageDisplay = getByText(messages.isEmailNotMatched);
    expect(errorMessageDisplay).toBeDefined();
  });

  it('should display alert with error when send invite api returns error', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: '1990-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api: apiWithSendInviteError,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      messages['serverErrors.inviteDependentUser.subject'],
      messages['serverErrors.inviteDependentUser.default'],
    );
  });

  it('should display alert with error when send invite api returns is email already taken error', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: '1990-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api: apiWithSendInviteEmailAlreadyInUseError,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    const errorText = screen.getByText(
      'Email already exist. Try a new email address.',
    );

    expect(errorText).toBeDefined();
  });

  it('should display alert and navigate after submission if there are no validation errors (spouse)', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: '1990-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      messages['profile.dependentInvite.alertHeader'],
      messages['profile.dependentInvite.alertInstructions'],
      [
        {
          onPress: expect.any(Function),
          text: 'Ok',
        },
      ],
      { cancelable: false },
    );

    act(() => {
      Alert.alert.mock.calls[0][2][0].onPress();
    });

    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should display alert and navigate after submission if there are no validation errors (child)', async () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const route = {
      params: {
        dependent: {
          email: 'dependent2@mail.com',
          fullName: 'Dependent 2',
          memberId: '2',
          relationshipCategory: 'Child',
          role: 'Dependent',
          dateOfBirth: '2000-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    expect(Alert.alert).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      messages['profile.dependentInvite.alertHeader'],
      messages['profile.dependentInvite.alertInstructions'],
      [
        {
          onPress: expect.any(Function),
          text: 'Ok',
        },
      ],
      { cancelable: false },
    );

    act(() => {
      Alert.alert.mock.calls[0][2][0].onPress();
    });

    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it('should disable date input box if DoB provided', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: '1990-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const dateField = screen.getByType(SelectField);

    expect(dateField.props.disabled).toBeTruthy();
  });

  it('should enable date input box if no DoB provided', () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: null,
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const dateField = screen.getByType(SelectField);

    expect(dateField.props.disabled).toBeFalsy();
  });

  it('should display error message if date is out of validate range date (spouse)', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: '2010-09-17T00:00:00',
        },
      },
    };
    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();

    expect(screen.getByText(messages.invalidDoB)).toBeDefined();
  });

  it('should display error message if date is out of validate range date (child)', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent2@mail.com',
          fullName: 'Dependent 2',
          memberId: '2',
          relationshipCategory: 'Child',
          role: 'Dependent',
          dateOfBirth: '1990-09-17T00:00:00',
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();

    expect(screen.getByText(messages.invalidDoB)).toBeDefined();
  });

  it('should display error message if date field is empty', async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const route = {
      params: {
        dependent: {
          email: 'dependent1@mail.com',
          fullName: 'Dependent 1',
          memberId: '1',
          relationshipCategory: 'Spouse',
          role: 'Dependent',
          dateOfBirth: null,
        },
      },
    };

    const [screen] = renderForTestWithStore(
      <ProfileDependentInviteScreen navigation={navigation} route={route} />,
      {
        initialState,
        api,
      },
    );

    const inputs = screen.getAllByType(TextInput);
    const depdentEmailInput = inputs[0];
    const confirmEmailInput = inputs[1];

    fireEvent.changeText(depdentEmailInput, 'a@b.com');
    fireEvent(depdentEmailInput, 'blur');
    fireEvent.changeText(confirmEmailInput, 'a@b.com');
    fireEvent(confirmEmailInput, 'blur');

    var button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });

    await flushMicrotasksQueue();

    expect(screen.getByText(messages.isRequired)).toBeDefined();
  });
});
