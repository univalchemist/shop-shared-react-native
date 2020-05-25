import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import {
  Box,
  Footer,
  ScrollView,
  Text,
  Divider,
  TrackedButton,
  Flex,
} from '@shops/wrappers/components';
import { useIntl, useTheme } from '@shops/wrappers/core/hooks';
import { BillingAddresses, BackButton } from '@shops/components';

const formatPrice = price => parseFloat(price).toFixed(2);

const CheckoutScreen = ({ navigation, grandTotal, defaultCurrencySymbol }) => {
  const intl = useIntl();
  const theme = useTheme();

  const grandTotalPrice = `${defaultCurrencySymbol} ${formatPrice(grandTotal)}`;

  const onAddressChange = address => {
    console.log(address);
  };

  const onAddressFormChange = addressForm => {
    console.log(addressForm);
  };

  return (
    <Box flex={1}>
      <BackButton navigation={navigation} labelId="shop.common.cart" />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text fontWeight={600} fontSize={18}>
          {intl.formatMessage({ id: 'shop.common.checkout' })}
        </Text>
        <Flex flexDirection="row" justifyContent="space-between">
          <Text fontWeight={600}>
            {intl.formatMessage({ id: 'shop.checkout.orderTotal' })}
          </Text>
          <Text fontWeight={600}>{grandTotalPrice}</Text>
        </Flex>
        <Divider full mt={32} mb={32} />
        <BillingAddresses
          onChange={onAddressChange}
          onFormChange={onAddressFormChange}
        />
      </ScrollView>
      <Footer
        flexDirection="row"
        style={[
          styles.footerContainer,
          { backgroundColor: theme.colors.white },
        ]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              onPress={() => {}}
              title={intl.formatMessage({ id: 'shop.checkout.payNow' })}
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
  footerContainer: {
    paddingBottom: 16,
  },
});

const mapStateToProps = ({ shop: { cart, config } }) => {
  const { totals } = cart;
  const { currency } = config;

  return {
    defaultCurrencySymbol: currency.defaultCurrencySymbol,
    grandTotal: totals.grandTotal || 0,
  };
};

export default connect(mapStateToProps)(CheckoutScreen);
