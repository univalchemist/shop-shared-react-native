import React from 'react';
import { ShopWebView } from '../ShopWebView';
import { renderForTest } from '@testUtils';
import WebView from 'react-native-webview';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { Storage } from '@utils';
import { Linking } from 'react-native';

describe('ShopWebView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should be visible to user', () => {
    const Component = renderForTest(
      <ShopWebView
        source={{ uri: 'https://shop-url' }}
        setIsAuthorized={jest.fn()}
        clientId="cxadevclient1"
        isAuthorized={true}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    expect(webViewComponent.props.containerStyle.height).toEqual('100%');
  });

  it('should be invisible to user', () => {
    const Component = renderForTest(
      <ShopWebView
        source={{ uri: 'https://shop-url' }}
        setIsAuthorized={jest.fn()}
        clientId="cxadevclient1"
        isAuthorized={false}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    expect(webViewComponent.props.containerStyle.height).toEqual(0);
  });

  it('should render webview with passed in uri', () => {
    const setIsAuthorized = jest.fn();

    const Component = renderForTest(
      <ShopWebView
        source={{ uri: 'https://shop-url/shop-url' }}
        setIsAuthorized={setIsAuthorized}
        clientId="cxadevclient1"
        isAuthorized={true}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    const onLoadStart = webViewComponent.props.onLoadStart;

    jest.spyOn(Storage, 'save').mockResolvedValue(null);

    onLoadStart({
      nativeEvent: { url: 'https://shop-url/cxadevclient1/stores' },
    });

    expect(webViewComponent.props.source).toEqual({
      uri: 'https://shop-url/shop-url',
    });
    expect(setIsAuthorized).toHaveBeenCalledWith(true);
    expect(Storage.save).toHaveBeenCalledWith(Storage.IS_LOGGED_IN_SSO, 'true');
  });

  it('should render webview with passed in sso email in uri', () => {
    const setIsAuthorized = jest.fn();
    const Component = renderForTest(
      <ShopWebView
        source={{ uri: 'https://shop-url/shop-url' }}
        setIsAuthorized={setIsAuthorized}
        clientId="cxadevclient1"
        isAuthorized={true}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    const onLoadStart = webViewComponent.props.onLoadStart;

    jest.spyOn(Storage, 'save').mockResolvedValue(null);

    onLoadStart({ nativeEvent: { url: 'https://shop-url/sso/email' } });

    expect(webViewComponent.props.source).toEqual({
      uri: 'https://shop-url/shop-url',
    });

    expect(setIsAuthorized).toHaveBeenCalledWith(true);
    expect(Storage.save).toHaveBeenCalledWith(Storage.IS_LOGGED_IN_SSO, 'true');
  });

  it('should handle all urls except for mailto and tel', () => {
    const Component = renderForTest(
      <ShopWebView
        source={{ uri: 'https://shop-url' }}
        setIsAuthorized={jest.fn()}
        clientId="cxadevclient1"
        isAuthorized={true}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    const shouldStartLoad = webViewComponent.props.onShouldStartLoadWithRequest;

    expect(shouldStartLoad({ url: 'http://some-regular-url' })).toBe(true);
    expect(shouldStartLoad({ url: 'mailto:someemail@email.com' })).toBe(false);
    expect(shouldStartLoad({ url: 'tel:76588211' })).toBe(false);
  });

  it('should call open link when email is loaded', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());

    renderForTest(
      <ShopWebView
        source={{ uri: 'mailto:someemail@email.com' }}
        setIsAuthorized={jest.fn()}
        clientId="cxadevclient1"
        isAuthorized={true}
        onUnAuthorized={jest.fn()}
      />,
    );

    await flushMicrotasksQueue();
    act(() => {});

    expect(Linking.openURL).toHaveBeenCalledWith('mailto:someemail@email.com');
  });

  it('should setAuthorized to false when session expired and current url include sso/unauthorize', async () => {
    const setIsAuthorized = jest.fn();
    const onUnAuthorized = jest.fn();
    const Component = renderForTest(
      <ShopWebView
        setIsAuthorized={setIsAuthorized}
        source={{ uri: 'https://shop-url' }}
        clientId="cxadevclient1"
        isAuthorized={false}
        onUnAuthorized={onUnAuthorized}
      />,
    );
    const webViewComponent = Component.getByType(WebView);
    const shouldStartLoad = webViewComponent.props.onShouldStartLoadWithRequest;
    jest.spyOn(Storage, 'save').mockResolvedValue(null);

    expect(shouldStartLoad({ url: 'https://shop-url/sso/unauthorize' })).toBe(
      false,
    );

    expect(Storage.save).toHaveBeenCalledWith(
      Storage.IS_LOGGED_IN_SSO,
      'false',
    );
  });

  it('should open external link if user clicks on a link within shop', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const Component = renderForTest(
      <ShopWebView
        setIsAuthorized={jest.fn()}
        clientId="cxadevclient1"
        isAuthorized={true}
        source={{ uri: 'https://shop-url' }}
        onUnAuthorized={jest.fn()}
      />,
    );
    const webViewComponent = Component.getByType(WebView);

    act(() => {
      fireEvent(webViewComponent, 'message', {
        nativeEvent: {
          data: '{"type":"OpenExternalLink","url":"https://some-external-url"}',
        },
      });
    });

    expect(Linking.openURL).toHaveBeenCalledWith('https://some-external-url');
  });
});
