import React, { useState } from 'react';
import { InputField, TrackedButton } from '@shops/wrappers/components';
import { Box } from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';
import { Form } from 'react-final-form';

const DiscountCode = () => {
  // TODO: initialValue should get from reducer
  const intl = useIntl();

  const onSubmit = values => {
    console.log(values);
    // TODO: call applyDiscountCode
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ form, handleSubmit, submitting }) => {
        return (
          <Box>
            <InputField
              name="discountCode"
              autoCapitalize="none"
              hint={intl.formatMessage({ id: 'shop.common.optional' })}
              label={intl.formatMessage({
                id: 'shop.cart.discountCode',
              })}
              returnKeyType="send"
              testID="discountCode"
            />
            <Box mt={16}>
              <TrackedButton
                secondary
                onPress={handleSubmit}
                title={intl.formatMessage({
                  id: 'shop.cart.applyDiscountCode',
                })}
              />
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default DiscountCode;
