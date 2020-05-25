/* istanbul ignore file */
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render as renderComponent } from 'react-native-testing-library';
import createMockStore from 'redux-mock-store';
import { ThemeProvider } from 'react-native-elements';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import thunk from 'redux-thunk';
import { createPromise } from 'redux-promise-middleware';
import IntlWrapper from '@components/IntlWrapper';
import reducers from '@store/reducers';
import { mergeDeepRight } from 'ramda';
import theme from '../theme';
import messages from '../../messages/en-HK';
import healMessages from '@heal/messages/en-HK';
import { en_HK as shopMessages } from '@components/shops';

import MockRootNavigator from './MockRootNavigator';

const reduxPromiseMiddleware = createPromise({
  promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
});

const defaultOptions = {
  initialState: {
    intl: {
      messages: { ...messages, ...healMessages, ...shopMessages },
      intlLocale: 'en-HK',
      momentLocale: 'en-gb',
      locale: 'en-HK',
      initialNow: Date.now(),
    },
    user: {},
  },
  api: {},
};

export const renderForTest = (
  Component,
  { initialState, api } = defaultOptions,
) => {
  const mockStore = configureMockStore(api);
  return renderComponent(
    <Provider store={mockStore(initialState)}>
      <IntlWrapper>
        <ThemeProvider>
          <StyledThemeProvider theme={theme}>
            <MockRootNavigator component={Component} />
          </StyledThemeProvider>
        </ThemeProvider>
      </IntlWrapper>
    </Provider>,
  );
};

export const configureMockStore = api => (initialState = {}) =>
  createMockStore([thunk.withExtraArgument({ api }), reduxPromiseMiddleware])(
    mergeDeepRight(defaultOptions.initialState, initialState),
  );

export const configureStore = (api, initialState) =>
  createStore(
    reducers,
    initialState,
    applyMiddleware(thunk.withExtraArgument({ api }), reduxPromiseMiddleware),
  );

export const render = (component, { initialState, api } = defaultOptions) => {
  const store = configureStore(
    { ...defaultOptions.api, ...api },
    { ...defaultOptions.initialState, ...initialState },
  );

  const Component = renderComponent(
    <Provider store={store}>
      <IntlWrapper>
        <ThemeProvider>
          <StyledThemeProvider theme={theme}>
            <MockRootNavigator component={component} />
          </StyledThemeProvider>
        </ThemeProvider>
      </IntlWrapper>
    </Provider>,
  );

  const rerender = () => {
    Component.rerender(
      <Provider store={store}>
        <IntlWrapper>
          <ThemeProvider>
            <StyledThemeProvider theme={theme}>
              <MockRootNavigator component={component} />
            </StyledThemeProvider>
          </ThemeProvider>
        </IntlWrapper>
      </Provider>,
    );
  };

  return [Component, store, rerender];
};

export const renderWithoutStack = (
  Component,
  { initialState, api } = defaultOptions,
) => {
  const mockStore = configureMockStore(api);
  return renderComponent(
    <Provider store={mockStore(initialState)}>
      <IntlWrapper>
        <ThemeProvider>
          <StyledThemeProvider theme={theme}>{Component}</StyledThemeProvider>
        </ThemeProvider>
      </IntlWrapper>
    </Provider>,
  );
};

export const renderForTestWithStore = render;
