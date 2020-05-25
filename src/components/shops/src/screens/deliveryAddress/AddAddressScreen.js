import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Box, Footer, TrackedButton } from '@shops/wrappers/components';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { AddressForm, CheckBox } from '@shops/components';
import { validateRequired } from '@wrappers/core/validations';
import { addDeliveryAddress } from '@shops/store/actions';

const AddAddressScreen = ({ navigation, addDeliveryAddress }) => {
  const intl = useIntl();
  const theme = useTheme();
  const [isDefault, setIsDefault] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState(null);

  const validateForm = newForm => {
    const address1Error = validateRequired(newForm?.address1);
    const zipCodeError = validateRequired(newForm?.zipCode);
    const cityError = validateRequired(newForm?.city);
    const countryIdError = validateRequired(newForm?.countryId);

    if (!!address1Error || !!zipCodeError || !!countryIdError || !!cityError) {
      const arrErrors = {
        address1: address1Error
          ? intl.formatMessage({ id: address1Error })
          : '',
        zipCode: zipCodeError ? intl.formatMessage({ id: zipCodeError }) : '',
        city: cityError ? intl.formatMessage({ id: cityError }) : '',
      };

      if (countryIdError) {
        arrErrors.countryId = countryIdError;
      }

      setErrors(arrErrors);

      return false;
    } else {
      setErrors(null);
      return true;
    }
  };

  const onFormChange = form => {
    setForm(form);
    validateForm(form);
  };

  const toggleIsDefault = () => {
    setIsDefault(!isDefault);
  };

  const onSubmit = async () => {
    if (validateForm(form)) {
      const street = [form.address1];
      if (form.address2) {
        street.push(form.address2);
      }
      const region = { id: 0 };
      if (form.province) {
        region.code = form.province;
        region.region = form.province;
      }

      await addDeliveryAddress({
        regionId: 0,
        region,
        countryId: form.countryId,
        postCode: form.zipCode,
        city: form.city,
        isDefaultShipping: isDefault,
        street,
      });

      navigation.goBack();
    }
  };

  return (
    <Box flex={1} backgroundColor={theme.colors.background}>
      <Box flex={1} px={32} py={32}>
        <AddressForm
          navigation={navigation}
          onChange={onFormChange}
          errors={errors}
        />
        <CheckBox
          onPress={toggleIsDefault}
          checked={isDefault}
          label={intl.formatMessage({ id: 'shop.address.setDeliveryDefault' })}
        />
      </Box>
      <Footer
        flexDirection="row"
        style={[styles.footer, { backgroundColor: theme.colors.white }]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              onPress={onSubmit}
              title={intl.formatMessage({ id: 'shop.common.save' })}
            />
          </Box>
        </Box>
      </Footer>
    </Box>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingBottom: 16,
  },
});

export default connect(null, { addDeliveryAddress })(AddAddressScreen);
