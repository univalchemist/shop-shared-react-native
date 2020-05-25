import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  Box,
  TrackedButton,
  Text,
  SecondaryText,
} from '@shops/wrappers/components';
import { useIntl } from '@shops/wrappers/core/hooks';
import { deleteDeliveryAddress } from '@shops/store/actions';
import { SHOP_EDIT_ADDRESS_SCREEN } from '@shops/navigation/routes';

const AddressItem = ({
  index = 0,
  addressLine1,
  addressLine2,
  city,
  country,
  province, // TODO: where to get province
  zipCode,
  isDefault, // TODO: where to get isDefault
  deleteDeliveryAddress,
  navigation,
  id,
}) => {
  const intl = useIntl();

  const performRemoveAddress = () => {
    deleteDeliveryAddress(id);
  };

  const goToEditScreen = () => {
    navigation.navigate(SHOP_EDIT_ADDRESS_SCREEN, { addressId: id });
  };

  const onRemoveAddress = () => {
    Alert.alert(
      intl.formatMessage({ id: 'shop.address.removeAddressDialogTitle' }),
      intl.formatMessage({
        id: 'shop.address.removeAddressDialogMessage',
      }),
      [
        {
          text: intl.formatMessage({ id: 'shop.common.cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'shop.common.ok' }),
          onPress: performRemoveAddress,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Box>
      <Text fontWeight={600} fontSize={16}>
        {intl.formatMessage({ id: 'shop.address.addressIndex' }, { index })}
      </Text>
      {isDefault && (
        <SecondaryText fontSize={14}>
          {intl.formatMessage({ id: 'shop.address.defaultDeliveryAddress' })}
        </SecondaryText>
      )}
      <SecondaryText fontSize={14} mt={24}>
        {intl.formatMessage({ id: 'shop.address.streetAddress' })}
      </SecondaryText>
      <Text fontSize={14}>{addressLine1}</Text>
      <Text fontSize={14}>{addressLine2}</Text>
      <SecondaryText fontSize={14} mt={16}>
        {intl.formatMessage({ id: 'shop.address.city' })}
      </SecondaryText>
      <Text fontSize={14}>{city}</Text>
      {!!province && (
        <>
          <SecondaryText fontSize={14} mt={16}>
            {intl.formatMessage({ id: 'shop.address.province' })}
          </SecondaryText>
          <Text fontSize={14}>{province}</Text>
        </>
      )}
      <SecondaryText fontSize={14} mt={16}>
        {intl.formatMessage({ id: 'shop.address.country' })}
      </SecondaryText>
      <Text fontSize={14}>{country}</Text>
      {!!zipCode && (
        <>
          <SecondaryText fontSize={14} mt={16}>
            {intl.formatMessage({ id: 'shop.address.zipCode' })}
          </SecondaryText>
          <Text fontSize={14}>{zipCode}</Text>
        </>
      )}
      <Box mt={32}>
        <TrackedButton
          secondary
          onPress={goToEditScreen}
          title={intl.formatMessage({ id: 'shop.address.editAddress' })}
        />
      </Box>
      <Box mt={16}>
        <TrackedButton
          secondary
          onPress={onRemoveAddress}
          title={intl.formatMessage({ id: 'shop.address.deleteAddress' })}
        />
      </Box>
    </Box>
  );
};

export default connect(null, { deleteDeliveryAddress })(AddressItem);
