import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Box, ScrollView } from '@shops/wrappers/components';
import ProductDetails from './ProductDetails';
import MoreDetails from './MoreDetails';
import CustomOrder from './CustomOrder';
import { connect } from 'react-redux';
import {
  AddToCartButton,
  BackButton,
  SnackBar,
  Spinner,
} from '@shops/components';
import {
  ADD_TO_CART_FAILED,
  AddToCartSnackView,
  ADD_TO_CART_SUCCESS,
} from './AddToCartSnackView';
import { getCartTotals, getProductBySku } from '@shops/store/actions';
import { SHOP_CART_SCREEN } from '@shops/navigation/routes';

const SNACK_VIEW_HIDING_TIME = 3000;

export const ProductDetailsScreen = ({
  navigation,
  product,
  route: {
    params: { productSku },
  },
  getCartTotals,
  getProductBySku,
}) => {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    const getProduct = () => {
      getProductBySku(productSku);
    };
    getProduct();
  }, [getProductBySku, productSku]);

  const [snackBar, setSnackBar] = useState(false);
  if (!product) return <Spinner size={'small'} />; //make better UI later
  return (
    <Box flex={1}>
      <BackButton navigation={navigation} />
      <SnackBar
        visible={snackBar}
        position={'top'}
        autoHidingTime={SNACK_VIEW_HIDING_TIME}
        onSnackBarHided={() => setSnackBar(false)}
      >
        <AddToCartSnackView
          onContainerPress={() => {
            navigation.navigate(SHOP_CART_SCREEN);
          }}
          type={snackBar}
          onCancelPress={() => setSnackBar(false)}
          quantity={quantity}
        />
      </SnackBar>
      <ScrollView contentContainerStyle={style.scrollView}>
        <ProductDetails product={product} />
        <CustomOrder
          quantity={quantity}
          onChangeQuantity={setQuantity}
          deliveryFee={product.deliveryFee}
        />
        <MoreDetails product={product} navigation={navigation} />
      </ScrollView>
      <AddToCartButton
        quantity={quantity}
        sku={product.sku}
        onAddToCartSuccess={() => {
          setSnackBar(ADD_TO_CART_SUCCESS);
          getCartTotals();
        }}
        onAddToCartFailed={() => {
          //TODO this is temp approach, wait BA confirm later
          setSnackBar(ADD_TO_CART_FAILED);
        }}
      />
    </Box>
  );
};

const style = StyleSheet.create({
  scrollView: {
    marginHorizontal: 32,
    marginTop: 10,
  },
});

const mapStateToProps = (
  {
    shop: {
      home: { productMap },
    },
  },
  {
    route: {
      params: { productSku },
    },
  },
) => {
  return {
    product: productMap[productSku],
  };
};

export default connect(mapStateToProps, { getCartTotals, getProductBySku })(
  ProductDetailsScreen,
);
