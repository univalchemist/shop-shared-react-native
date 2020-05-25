import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import {
  Box,
  Text,
  SecondaryText,
  Image,
  Flex,
} from '@shops/wrappers/components';
import { icEdit, icDelete } from '@shops/assets/icons';
import { SHOP_EDIT_PRODUCT_SCREEN } from '@shops/navigation/routes';
import { useGetFormattedPrice, useIntl } from '@shops/wrappers/core/hooks';
import { removeItemFromCart, getCartTotals } from '@shops/store/actions';


const CartItem = ({
  thumbnail = 'https://www.wikihow.com/images/8/87/Type-in-a-Web-Address-to-Go-to-a-Specific-Website-Step-10.jpg',
  quantity,
  name,
  price,
  navigate,
  sku,
  removeItemFromCart,
  getCartTotals,
}) => {
  const intl = useIntl();
  const priceFmt = useGetFormattedPrice(price);
  const onPressEdit = () => {
    navigate && navigate(SHOP_EDIT_PRODUCT_SCREEN, { productSku: sku });
  };

  const onRemoveItem = () => {
    Alert.alert(
      intl.formatMessage({ id: 'shop.cartItem.removeItemDialogTitle' }),
      intl.formatMessage(
        {
          id: 'shop.cartItem.removeItemDialogMessage',
        },
        { name },
      ),
      [
        {
          text: intl.formatMessage({ id: 'shop.common.cancel' }),
          style: 'cancel',
        },
        {
          text: intl.formatMessage({ id: 'shop.common.ok' }),
          onPress: performRemoveItem,
        },
      ],
      { cancelable: true },
    );
  };

  const performRemoveItem = () => {
    // TODO: should add loading state
    removeItemFromCart(sku).then(() => {
      getCartTotals();
    });
  };

  return (
    <Flex flexDirection="row" mt={24}>
      <Box flex={1}>
        <Image
          source={{
            uri: thumbnail,
          }}
          width="100%"
          height={75}
          resizeMode="cover"
        />
      </Box>
      <Box flex={2} ml={16}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontWeight={600}>{priceFmt}</Text>
        <SecondaryText mt={8} size={12}>
          {`${intl.formatMessage({ id: 'shop.common.quantity' })}: ${quantity}`}
        </SecondaryText>
      </Box>
      <Box flex={0.5} alignItems="flex-end" mt={8}>
        <TouchableOpacity onPress={onPressEdit}>
          <Image source={icEdit} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemoveItem}>
          <Image source={icDelete} mt={16} />
        </TouchableOpacity>
      </Box>
    </Flex>
  );
};

export default connect(null, {
  removeItemFromCart,
  getCartTotals,
})(CartItem);
