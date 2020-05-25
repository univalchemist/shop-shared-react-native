import { Button, Loader } from '@wrappers/components';
import { render } from '@testUtils';
import React from 'react';
import { TextInput } from 'react-native';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import messages from '@messages/en-HK.json';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import { debounceAlert } from '@utils';

jest.mock('@utils', () => ({
  ...require.requireActual('@utils'),
  debounceAlert: jest.fn(),
}));

jest.useFakeTimers();

const route = {
  params: {
    clientId: 'clientIdFromParam',
    username: 'b@c.com',
  },
};

const api = {
  forgotPassword: jest.fn(({ username }) => {
    if (username === 'error@b.com') {
      return Promise.reject();
    }
    return Promise.resolve({ data: {} });
  }),
};

const validValues = {
  clientId: 'test',
  username: 'a@b.com',
};

const valuesWithErrorKey = {
  clientId: 'test',
  username: 'error@b.com', // triggers error
};

let screen, fields;

describe('ForgotPasswordScreen', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    [screen] = render(<ForgotPasswordScreen route={route} />, {
      api,
    });
    await flushMicrotasksQueue();
    fields = screen.queryAllByType(TextInput);
  });

  it('should render display text, all field inputs and button', async () => {
    expect(
      screen.getByText(messages['forgotPassword.introText']),
    ).toBeDefined();
    expect(
      screen.getByText(messages['forgotPassword.instructions']),
    ).toBeDefined();
    expect(fields).toHaveLength(2);
    expect(
      screen.getByProps({
        title: messages['forgotPassword.submitButtonLabel'],
      }),
    ).toBeDefined();
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('should validate company id and email', async () => {
    act(() => {
      fields.forEach(x => {
        fireEvent.changeText(x, '');
        fireEvent(x, 'blur');
      });
    });

    expect(screen.getByText(messages.invalidCompanyName)).toBeTruthy();
    expect(screen.getByText(messages.invalidEmail)).toBeTruthy();

    act(() => {
      fireEvent.changeText(fields[0], 'companynamewithinvalidchar.');
    });
    expect(screen.getByText(messages.invalidCompanyCharacters)).toBeTruthy();
    const submit = screen.getByType(Button);
    act(() => {
      fireEvent.press(submit);
    });
    expect(api.forgotPassword).not.toHaveBeenCalled();
  });

  it('should call forgotPassword api on submit', async () => {
    const submitButton = screen.getByProps({
      title: messages['forgotPassword.submitButtonLabel'],
    });

    act(() => {
      fields.forEach(field => {
        const name = field.props.name;
        fireEvent.changeText(field, validValues[name]);
      });
      fireEvent.press(submitButton);
    });

    await flushMicrotasksQueue();

    expect(api.forgotPassword).toHaveBeenCalledWith(validValues);
  });

  it('should display a loader while api request is being made', async () => {
    const submitButton = screen.getByProps({
      title: messages['forgotPassword.submitButtonLabel'],
    });
    act(() => {
      fields.forEach(field => {
        const name = field.props.name;
        fireEvent.changeText(field, validValues[name]);
      });
      fireEvent.press(submitButton);
    });
    expect(screen.queryByType(Loader)).toBeDefined();
    await flushMicrotasksQueue();
    expect(screen.queryByType(Loader)).toBeNull();
  });

  it('should invoke success alert on successful api response', async () => {
    const submitButton = screen.getByProps({
      title: messages['forgotPassword.submitButtonLabel'],
    });
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, validValues[name]);
      });
      fireEvent.press(submitButton);
    });

    await flushMicrotasksQueue();

    const successText = messages['forgotPassword.successText'].replace(
      '{email}',
      validValues.username,
    );
    expect(debounceAlert).toHaveBeenCalledWith({
      subject: messages['forgotPassword.successTitle'],
      message: successText,
    });
  });

  it('should invoke error alert if the API request fails', async () => {
    act(() => {
      fields.forEach(x => {
        const name = x.props.name;
        fireEvent.changeText(x, valuesWithErrorKey[name]);
      });
    });

    const submitButton = screen.getByProps({
      title: messages['forgotPassword.submitButtonLabel'],
    });
    act(() => {
      fireEvent.press(submitButton);
    });
    await flushMicrotasksQueue();

    expect(debounceAlert).toHaveBeenCalledWith({
      subject: messages['errorPanel.title'],
      message: messages['errorPanel.message'],
    });
  });
});
