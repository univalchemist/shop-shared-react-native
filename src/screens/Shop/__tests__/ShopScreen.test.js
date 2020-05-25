import React from 'react';
import { renderForTest, render } from '@testUtils';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import ShopScreen from '../ShopScreen';
import { ShopWebView } from '../ShopWebView';
import * as secureStore from '../../../services/secureStore';
import { Storage } from '@utils';

const password = {
  id_token: 'test_id_token',
  access_token: 'test_access_token',
};

jest.mock('react-native-config', () => ({
  SHOP_URL: 'https://shop-url',
}));

jest.spyOn(secureStore, 'fetchTokens').mockResolvedValue(password);

jest.mock('react-native-webview', () => {
  const React = require('react');
  const View = require('react-native').View;
  const injectJavaScriptSpy = jest.fn();

  class MockWebView extends React.Component {
    injectJavaScript = injectJavaScriptSpy;
    render() {
      return <View {...this.props} />;
    }
  }

  MockWebView.injectJavaScriptSpy = injectJavaScriptSpy;
  return MockWebView;
});

jest.useFakeTimers();

describe('ShopScreen with authorized user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.spyOn(Storage, 'get').mockResolvedValue('true');
  });

  it('should render shop webview', async () => {
    const Component = renderForTest(<ShopScreen />, {
      initialState: {
        user: {
          clientId: 'cxadevclient1',
        },
      },
    });

    const shopWebViewComponent = Component.getAllByType(ShopWebView);

    expect(shopWebViewComponent.length).toBe(1);
  });

  it('should navigate to a url passed by nav params when authenticated', async () => {
    const route = {
      params: {
        url: 'http://myuriparam/?uuid=uuid',
      },
    };
    const Component = renderForTest(<ShopScreen route={route} />, {
      initialState: {
        user: {
          clientId: 'cxadevclient1',
        },
      },
    });

    const shopWebViewComponent = Component.getByType(ShopWebView);
    await flushMicrotasksQueue();

    expect(shopWebViewComponent.props.source.uri).toEqual(
      'http://myuriparam/?uuid=uuid',
    );
  });
});

describe('ShopScreen with unauthorized user', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.spyOn(Storage, 'get').mockResolvedValue('false');
  });

  it('should render shop web view', async () => {
    const Component = renderForTest(<ShopScreen />, {
      initialState: {
        user: {
          clientId: 'cxadevclient1',
        },
      },
    });

    const shopWebViewComponent = Component.getAllByType(ShopWebView);

    expect(shopWebViewComponent.length).toBe(1);
  });

  it('should navigate to login url', async () => {
    const route = {
      params: {
        url: 'http://myuriparam',
      },
    };

    const Component = renderForTest(<ShopScreen route={route} />, {
      initialState: {
        user: {
          clientId: 'cxadevclient1',
        },
      },
    });

    const shopWebViewComponent = Component.getByType(ShopWebView);
    await flushMicrotasksQueue();

    expect(shopWebViewComponent.props.source).toHaveProperty(
      'uri',
      'https://shop-url/sso/token/receive?platform=ios',
    );
    expect(shopWebViewComponent.props.source).toHaveProperty('body');
    expect(shopWebViewComponent.props.source).toHaveProperty('method', 'POST');
    expect(shopWebViewComponent.props.source).toHaveProperty('headers');
  });
});
