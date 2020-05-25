import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, DEFAULT_CURRENCY } from '@config/locale';
import { IntlContextProvider } from '@wrappers/core/hooks';

const IntlWrapper = ({ children, intl }) => {
  const { initialNow, intlLocale, messages } = intl;

  return (
    <IntlProvider
      initialNow={initialNow}
      locale={intlLocale}
      messages={messages}
      defaultLocale={DEFAULT_LOCALE}
      textComponent={Text}
      formats={{
        number: {
          money: {
            currency: DEFAULT_CURRENCY,
            style: 'currency',
            currencyDisplay: 'symbol',
          },
        },
      }}
    >
      <IntlContextProvider>{children}</IntlContextProvider>
    </IntlProvider>
  );
};

IntlWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  intl: PropTypes.shape({
    initialNow: PropTypes.number,
    locale: PropTypes.string,
    messages: PropTypes.object,
  }).isRequired,
};

export default connect(({ intl }) => ({
  intl,
}))(IntlWrapper);
