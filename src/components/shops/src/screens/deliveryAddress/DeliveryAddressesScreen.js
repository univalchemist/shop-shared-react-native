import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import {
  Box,
  Text,
  Footer,
  TrackedButton,
  ScrollView,
  Divider,
} from '@shops/wrappers/components';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { SHOP_ADD_ADDRESS_SCREEN } from '@shops/navigation/routes';
import { getDeliveryAddresses } from '@shops/store/actions';
import { getDeliveryAddressesSelector } from '@shops/store/selectors';
import AddressItem from './AddressItem';

const DeliveryAddressesScreen = ({
  navigation,
  addresses,
  getDeliveryAddresses,
}) => {
  const intl = useIntl();
  const theme = useTheme();

  const goToAddNewAddress = () => {
    navigation.navigate(SHOP_ADD_ADDRESS_SCREEN);
  };

  useEffect(() => {
    getDeliveryAddresses();
  }, [getDeliveryAddresses]);

  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text fontWeight={600} fontSize={18} mb={32}>
          {intl.formatMessage({ id: 'shop.address.delivery' })}
        </Text>
        {addresses.length === 0 && (
          <Text>
            {intl.formatMessage({ id: 'shop.address.noDeliveryAddress' })}
          </Text>
        )}
        {addresses.map((address, index) => {
          return (
            <Fragment key={address.id}>
              <AddressItem
                index={index + 1}
                id={address.id}
                addressLine1={address.street?.[0]}
                addressLine2={address.street?.[1]}
                country={address.country?.name}
                city={address.city}
                zipCode={address.postCode}
                navigation={navigation}
                isDefault={address.isDefaultShipping}
              />
              {index !== addresses.length - 1 && (
                <Divider full mt={32} mb={32} />
              )}
            </Fragment>
          );
        })}
      </ScrollView>
      <Footer
        flexDirection="row"
        style={[styles.footer, { backgroundColor: theme.colors.white }]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              onPress={goToAddNewAddress}
              title={intl.formatMessage({ id: 'shop.address.addNew' })}
            />
          </Box>
        </Box>
      </Footer>
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 32,
  },
  footer: {
    paddingBottom: 16,
  },
});

const mapStateToProps = ({ shop }) => {
  const addresses = getDeliveryAddressesSelector(shop);

  return {
    addresses,
  };
};

export default connect(mapStateToProps, { getDeliveryAddresses })(
  DeliveryAddressesScreen,
);
