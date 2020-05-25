import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import {
  Box,
  Footer,
  ScrollView,
  Text,
  Flex,
  Divider,
  SecondaryText,
  TrackedButton,
} from '@shops/wrappers/components';
import { SHOP_CHECKOUT_SCREEN } from '@shops/navigation/routes';
import { ShippingAddresses } from '@shops/components';
import {
  useGetFormattedPrice,
  useIntl,
  useTheme,
} from '@shops/wrappers/core/hooks';
import { getCart, getCartTotals } from '@shops/store/actions';
import CartEmpty from './CartEmpty';
import ItemList from './ItemList';
import DiscountCode from './DiscountCode';

const SubTotal = ({ numberItems, price }) => {
  const intl = useIntl();

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Text fontWeight={600}>
        {intl.formatMessage(
          { id: 'shop.cart.subtotal' },
          { number_items: numberItems },
        )}
      </Text>
      <Text fontWeight={600}>{price}</Text>
    </Flex>
  );
};

const PaymentSummaryLine = ({ labelId, value }) => {
  const intl = useIntl();

  return (
    <Flex mb={8} flexDirection="row" justifyContent="space-between">
      <SecondaryText>{intl.formatMessage({ id: labelId })}</SecondaryText>
      <SecondaryText>{value}</SecondaryText>
    </Flex>
  );
};

const CartScreen = ({
  navigation,
  isCartEmpty,
  itemsCount,
  subTotal,
  discount,
  getCart,
  getCartTotals,
}) => {
  const intl = useIntl();
  const theme = useTheme();

  useEffect(() => {
    const init = async () => {
      await getCart();
      await getCartTotals();
    };

    init();
  }, [getCart, getCartTotals]);
  
  const subTotalPrice = useGetFormattedPrice(subTotal);
  const discountPrice = useGetFormattedPrice(discount);
  
  if (isCartEmpty) {
    return <CartEmpty navigation={navigation} />;
  }

  const onAddressChange = address => {
    console.log(address);
  };

  const onAddressFormChange = addressForm => {
    console.log(addressForm);
  };

  const goToCheckout = () => {
    navigation.navigate(SHOP_CHECKOUT_SCREEN);
  };

  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text fontWeight={600} fontSize={18}>
          {intl.formatMessage({ id: 'shop.common.cart' })}
        </Text>
        <SubTotal numberItems={itemsCount} price={subTotalPrice} />
        <Text mt={24}>
          {intl.formatMessage({ id: 'shop.common.delivery' })}
        </Text>
        <ItemList navigation={navigation} />
        <Divider full mt={32} mb={32} />
        <DiscountCode />
        <Divider full mt={32} mb={32} />
        <ShippingAddresses
          onChange={onAddressChange}
          onFormChange={onAddressFormChange}
        />
        <Divider full mt={32} mb={32} />
        <Box>
          <Text fontWeight={600} fontSize={18} mb={24}>
            {intl.formatMessage({ id: 'shop.cart.paymentSummary' })}
          </Text>
          <PaymentSummaryLine
            labelId="shop.cart.paymentByShopWallet"
            value={subTotalPrice}
          />
          <PaymentSummaryLine
            labelId="shop.cart.discountCode"
            value={discountPrice}
          />
          <Box mt={8} mb={16}>
            <SubTotal numberItems={itemsCount} price={subTotalPrice} />
          </Box>
          <Box mt={8}>
            <SecondaryText fontSize={14} fontWeight={600}>
              {intl.formatMessage({ id: 'shop.common.note' })}
            </SecondaryText>
            <SecondaryText fontSize={14}>
              {intl.formatMessage({ id: 'shop.cart.noteDesc' })}
            </SecondaryText>
          </Box>
        </Box>
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
              onPress={goToCheckout}
              title={intl.formatMessage({ id: 'shop.cart.proceedToCheckout' })}
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

const mapStateToProps = ({ shop: { cart } }) => {
  const { itemsQty, itemsCount, isActive, totals } = cart;
  return {
    isCartEmpty: itemsCount === 0 || !isActive,
    itemsQty,
    itemsCount,
    subTotal: totals.subTotal || 0,
    discount: totals.discount || 0,

  };
};

export default connect(mapStateToProps, { getCart, getCartTotals })(CartScreen);
