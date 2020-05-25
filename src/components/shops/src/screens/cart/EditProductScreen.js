import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Box, TrackedButton, Footer, Text } from '@shops/wrappers/components';
import { BorderInput, QuantityButton, ProductHeader } from '@shops/components';
import {
  getProductBySku,
  addToCart,
  getCartTotals,
} from '@shops/store/actions';
import { useTheme, useIntl } from '@shops/wrappers/core/hooks';

const EditItemScreen = ({
  navigation,
  product,
  cartItem,
  getProductBySku,
  addToCart,
  getCartTotals,
}) => {
  const theme = useTheme();
  const intl = useIntl();
  const [quantity, setQuantity] = useState(cartItem.quantity);

  useEffect(() => {
    const getProduct = async () => {
      getProductBySku(cartItem.sku);
    };

    if (!product) getProduct();
  }, [cartItem.sku, getProductBySku, product]);

  const decreaseAmount = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const increaseAmount = () => {
    setQuantity(quantity + 1);
  };

  const onPressApply = () => {
    // TODO: should use updateCart, waiting for BE response
    addToCart({ sku: cartItem.sku, quantity }).then(() => {
      getCartTotals();
    });
    navigation.goBack();
  };

  return (
    <Box flex={1} backgroundColor={theme.colors.background}>
      <Box flex={1} px={4} pt={4}>
        <ProductHeader product={product} />
        <Box flexDirection="row" alignItems="center" my={24}>
          <Text width={'35%'}>
            {intl.formatMessage({
              id: 'shop.product.quantity',
              defaultMessage: 'Quantity',
            })}
          </Text>
          <Box
            width={'65%'}
            flexDirection={'row'}
            alignItems="center"
            justifyContent={'space-between'}
          >
            <QuantityButton text="-" onPress={decreaseAmount} />
            <BorderInput
              value={quantity}
              textAlign={'center'}
              width={70}
              height={56}
              keyboardType={'numeric'}
              onChangeText={text => {
                if (!text) {
                  setQuantity(1);
                } else {
                  setQuantity(parseInt(text.replace(/[^0-9]/g, ''), 10));
                }
              }}
            />
            <QuantityButton text="+" onPress={increaseAmount} />
          </Box>
        </Box>
      </Box>
      <Footer
        flexDirection="row"
        style={[styles.footer, { backgroundColor: theme.colors.white }]}
      >
        <Box flex={1} flexDirection="row">
          <Box flex={1}>
            <TrackedButton
              primary
              onPress={onPressApply}
              title={intl.formatMessage({ id: 'shop.common.apply' })}
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

const mapStateToProps = (
  { shop: { home, cart } },
  {
    route: {
      params: { productSku },
    },
  },
) => {
  return {
    product: home.productMap[productSku],
    cartItem: cart.items.find(i => i.sku === productSku),
  };
};

export default connect(mapStateToProps, {
  getProductBySku,
  addToCart,
  getCartTotals,
})(EditItemScreen);
