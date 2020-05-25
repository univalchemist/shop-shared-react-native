import { Button, Image } from '@wrappers/components';
import { TERMS_CONDITIONS_MODAL, FORGOT_PASSWORD } from '@routes';
import { render } from '@testUtils';
import React from 'react';
import { TextInput } from 'react-native';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
// import { saveTokens, saveCredentials } from '@services/secureStore';
import messages from '@messages/en-HK.json';
import { debounceAlert } from '@utils';
import LoginScreen, { LoginScreen as PureLoginScreen } from '../LoginScreen';
import navigation from '@testUtils/__mocks__/navigation';
import { Storage } from '@utils';
import { LOGIN_SUCCESS } from '../../../store/user/types';
import { iosFaceId, iosTouchId, androidFingerPrint } from '@images';
import * as Keychain from 'react-native-keychain';

jest.mock('@services/secureStore', () => ({
  saveTokens: jest.fn(),
  saveCredentials: jest.fn(),
  fetchCredentials: jest.fn(() => ({
    username: 'a@b.com',
    password: 'secret',
  })),
}));

jest.mock('@navigations', () => ({
  useFirebase: () => ({
    updateClientId: jest.fn(),
  }),
}));
jest.mock('jwt-decode', () =>
  jest.fn(() => ({
    sub: 'auth|3',
  })),
);
jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(() => ({
    success: true,
  })),
}));

jest.useFakeTimers();

jest.mock('@utils', () => ({
  ...require.requireActual('@utils'),
  debounceAlert: jest.fn(),
}));

const api = {
  login: jest.fn((values, callback) => {
    if (values.username === 'unknownerror@test.com') {
      return Promise.reject();
    }
    if (values.username === 'errorkey@test.com') {
      return Promise.reject({
        response: {
          data: {
            errors: [
              {
                messageKey: 'Unauthorized',
              },
            ],
          },
        },
      });
    }
    callback({ role: 'employee' });
    return Promise.resolve();
  }),
};

const loginAction = (values, callback) => {
  if (values.username === 'employee@test.com') {
    callback({ role: 'employee' });
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: 'employee accessToken',
      },
    });
  } else if (values.username === 'dependent@test.com') {
    callback({ role: 'dependent' });
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        accessToken: 'dependent accessToken',
      },
    });
  }
};

const validValues = {
  clientname: 'test',
  username: 'a@b.com',
  password: 'secret',
};
const employeeCredentialMock = {
  clientname: 'test',
  username: 'employee@test.com',
  password: 'secret',
};
const dependentCredentialMock = {
  clientname: 'test',
  username: 'dependent@test.com',
  password: 'secret',
};
const valuesWithErrorKey = {
  clientname: 'test',
  username: 'errorkey@test.com', // triggers error
  password: 'secret',
};
const valuesWithUnknownError = {
  clientname: 'test',
  username: 'unknownerror@test.com', // triggers error
  password: 'secret',
};

let screen, store, fields;

describe('LoginScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    [screen, store] = render(<LoginScreen navigation={navigation} />, {
      api,
    });
    await flushMicrotasksQueue();
    fields = screen.queryAllByType(TextInput);
  });

  it('should render all inputs on login screen', async () => {
    expect(fields).toHaveLength(3);
  });

  it('should validate invalid values', async () => {
    fields.forEach(x => {
      fireEvent.changeText(x, '');
      fireEvent(x, 'blur');
    });

    expect(screen.getByText(messages.invalidCompanyName)).toBeTruthy();
    expect(screen.getByText(messages.invalidEmail)).toBeTruthy();
    expect(screen.getByText(messages.invalidPassword)).toBeTruthy();

    fireEvent.changeText(fields[0], 'companynamewithinvalidchar.');

    expect(screen.getByText(messages.invalidCompanyCharacters)).toBeTruthy();
    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    expect(api.login).not.toHaveBeenCalled();
  });
  it('should auto fills fields if  savedLoginCredentials have data ', async () => {
    jest
      .spyOn(Storage, 'get')
      .mockReturnValue(
        JSON.stringify({ clientId: 'clientId', username: 'a@b.com' }),
      );

    [screen, store] = render(<LoginScreen navigation={navigation} />, {
      api,
    });
    await flushMicrotasksQueue();
    fields = screen.queryAllByType(TextInput);

    expect(fields[0].props.value).toEqual('clientId');
    expect(fields[1].props.value).toEqual('a@b.com');
  });

  it('should navigate when login success ', async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    [screen, store] = render(
      <PureLoginScreen navigation={navigation} login={loginAction} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    fields = screen.queryAllByType(TextInput);
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, employeeCredentialMock[name]);
      });
    });

    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();
    expect(store.getState().user.accessToken).toEqual('employee accessToken');
  });

  it('should navigate to dependent route when account is dependent ', async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    [screen, store] = render(
      <PureLoginScreen navigation={navigation} login={loginAction} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    fields = screen.queryAllByType(TextInput);
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, dependentCredentialMock[name]);
      });
    });

    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();
    expect(store.getState().user.accessToken).toEqual('dependent accessToken');
  });

  it('should invoke Alert when server returns error', async () => {
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, valuesWithErrorKey[name]);
      });
    });

    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(debounceAlert).toHaveBeenCalledWith({
      subject: messages['serverErrors.login.subject'],
      message: messages['serverErrors.login.Unauthorized'],
    });
  });

  it('should invoke Alert when server returns unknown error', async () => {
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, valuesWithUnknownError[name]);
      });
    });

    const button = screen.getByType(Button);
    act(() => {
      fireEvent.press(button);
    });
    await flushMicrotasksQueue();

    expect(debounceAlert).toHaveBeenCalled();
  });

  it('should navigate to the forgot password screen', async () => {
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, validValues[name]);
      });
    });
    const link = screen.getByText(messages.loginForgotPasswordLinkText);
    expect(link).toBeDefined();
    act(() => {
      fireEvent.press(link);
    });
    await flushMicrotasksQueue();

    expect(navigation.navigate).toHaveBeenCalledWith(FORGOT_PASSWORD, {
      clientId: validValues.clientname,
      username: validValues.username,
    });
  });

  it('should navigate to Terms and Conditions modal', () => {
    const link = screen.getByText(messages['login.termsAndConditions']);
    act(() => {
      fireEvent.press(link);
    });

    expect(navigation.navigate).toHaveBeenCalledWith(TERMS_CONDITIONS_MODAL);
  });
});

jest.mock('react-native-keychain');
describe('login with biometrics', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    const FeatureToggle = require('@config/FeatureToggle').default;
    FeatureToggle.USE_BIOMETRICS.turnOn();
    jest
      .spyOn(Storage, 'get')
      .mockReturnValue(
        JSON.stringify({ clientId: 'clientId', username: 'a@b.com' }),
      );
  });

  it('should render ios faceID biomtry button', async () => {
    Keychain.getSupportedBiometryType.mockResolvedValue('FaceID');
    const [component, store] = render(<LoginScreen navigation={navigation} />, {
      api,
    });
    await flushMicrotasksQueue();
    expect(component.queryAllByType(Image)[1].props.source).toBe(iosFaceId);
  });

  it('should render ios touchID biomtry button', async () => {
    Keychain.getSupportedBiometryType.mockResolvedValue('TouchID');
    const [component, store] = render(<LoginScreen navigation={navigation} />, {
      api,
    });
    await flushMicrotasksQueue();
    expect(component.queryAllByType(Image)[1].props.source).toBe(iosTouchId);
  });
  it('should render android Fingerprint biomtry button', async () => {
    Keychain.getSupportedBiometryType.mockResolvedValue('Fingerprint');
    const [component, store] = render(<LoginScreen navigation={navigation} />, {
      api,
    });
    await flushMicrotasksQueue();
    expect(component.queryAllByType(Image)[1].props.source).toBe(
      androidFingerPrint,
    );
  });
  // it('should login with biometrics properly', async () => {
  //   jest
  //     .spyOn(Storage, 'get')
  //     .mockReturnValue(JSON.stringify({ clientId: 'clientId' }));
  //   const buttons = screen.queryAllByType(Button);
  //   fireEvent(buttons[1], 'press');
  //   await flushMicrotasksQueue();
  //   expect(api.login).toBeCalledWith({
  //     clientId: 'clientId',
  //     username: 'a@b.com',
  //     password: 'secret',
  //   });
  // });
});
