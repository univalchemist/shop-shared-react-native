import React from 'react';
import BackgroundSSOLoginWebView, {
  doLoginScript,
} from '../BackgroundSSOLoginWebView';
import { renderForTest } from '@testUtils';
import WebView from 'react-native-webview';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { fetchCredentials } from '@services/secureStore';

jest.useFakeTimers();

describe('doLoginScript', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should call doLogin function', () => {
    const doLogin = jest.fn();
    const postMessageSpy = jest.fn();
    const window = {
      ReactNativeWebView: {
        postMessage: postMessageSpy,
      },
    };

    // Try executing the code
    eval(doLoginScript('username', 'password')); // eslint-disable-line no-eval
    jest.runAllTimers();

    expect(doLogin).toHaveBeenCalled();

    const onErrorCallback = doLogin.mock.calls[0][2];
    onErrorCallback('some error message');

    expect(postMessageSpy).toHaveBeenCalledWith(
      '{"type":"LoginError","error":"some error message"}',
    );
  });
});

jest.mock('react-native-webview', () => {
  const React = require('react');
  const View = require('react-native').View;
  const injectJavaScriptSpy = jest.fn();
  const reloadSpy = jest.fn();

  class MockWebView extends React.Component {
    injectJavaScript = injectJavaScriptSpy;
    reload = reloadSpy;
    render() {
      return <View {...this.props} />;
    }
  }

  MockWebView.injectJavaScriptSpy = injectJavaScriptSpy;
  MockWebView.reloadSpy = reloadSpy;
  return MockWebView;
});

jest.mock('@services/secureStore', () => ({
  fetchCredentials: jest.fn(),
}));

jest.mock('react-native-config', () => ({
  SHOP_AUTHORIZE_URI: 'https://shop-authorize-uri',
  SHOP_AUTHORIZE_LOGIN_URI: 'https://shop-authorize-login-url',
  SHOP_URL: 'https://shop-url',
}));

describe('BackgroundSSOLoginWebView', () => {
  it('should not be visible to user', () => {
    const props = {
      accountInfo: {},
      onLogin: () => {},
    };
    const Component = renderForTest(<BackgroundSSOLoginWebView {...props} />);
    const webViewComponent = Component.getByType(WebView);
    expect(webViewComponent.props.height).toEqual(0);
  });

  it('should invoke login function when webload is loaded', async () => {
    const props = {
      accountInfo: {
        username: 'someusername',
        password: 'somepassword',
      },
      onLogin: jest.fn(),
    };
    const component = renderForTest(<BackgroundSSOLoginWebView {...props} />);
    const webViewComponent = component.getByType(WebView);
    act(() => {
      fireEvent(webViewComponent, 'onLoad');
    });
    await flushMicrotasksQueue();
    jest.runOnlyPendingTimers();

    expect(props.onLogin).toHaveBeenCalled();
  });
});
