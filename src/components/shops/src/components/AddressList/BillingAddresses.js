import React from 'react';
import { useIntl } from '@shops/wrappers/core/hooks';
import CartAddresses from './CartAddresses';

const BillingAddresses = ({ onChange, onFormChange }) => {
  const intl = useIntl();

  // TODO: connect billing address reducer
  const addresses = [
    {
      id: -1,
      text: intl.formatMessage({ id: 'shop.address.sameAsDelivery' }),
    },
    {
      id: 1,
      text: 'Flat 25, 12/F, Acacia Bldg 150, Stirling Road, 140150',
    },
    {
      id: 0,
      text: intl.formatMessage({ id: 'shop.address.newBilling' }),
    },
  ];

  const onAddressChange = id => {
    onChange && onChange(id);
  };

  return (
    <CartAddresses
      addresses={addresses}
      title={intl.formatMessage({ id: 'shop.address.billing' })}
      saveAddressLabel={intl.formatMessage({
        id: 'shop.address.saveBilling',
      })}
      onChange={onAddressChange}
      onFormChange={onFormChange}
    />
  );
};

export default BillingAddresses;
