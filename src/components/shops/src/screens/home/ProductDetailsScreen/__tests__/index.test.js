import React from 'react';
import { renderForTest } from '@testUtils';
import ProductDetailsScreen from '../index';
import ProductDetails from '../ProductDetails';
import { MoreDetail } from '../MoreDetails';
import { AddCartButton } from '@shops/components/AddCartButton';
import CustomOrder from '../CustomOrder';
import navigation from '@testUtils/__mocks__/navigation';
import { BackButton, SnackBar, Spinner } from '@shops/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { AddToCartSnackView } from '@shops/screens/home/ProductDetailsScreen/AddToCartSnackView';
import { SHOP_CART_SCREEN } from '@shops/navigation/routes';

const initialState = {
  shop: {
    home: {
      productMap: {
        Product_01: {
          id: 1,
          sku: 'Product_01',
          name: 'Product 01',
          attributeSetId: 4,
          price: 1000,
          finalPrice: 1000,
          status: 1,
          visibility: 4,
          type: 'simple',
          categoryIds: [3, 8, 59],
          discountPercent: 0,
          description:
            'Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          shortDescription:
            'Short Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
          vendor: 'TESTVENDOR DONOTSHIP',
          mainImage: {
            id: 0,
            file: 'url0',
            position: 0,
          },
          smallImage: {
            id: 0,
            file: 'url0',
            position: 0,
          },
          thumbnail: {
            id: 0,
            file: 'url0',
            position: 0,
          },
          images: [
            {
              id: 4,
              file: 'url4',
              position: 0,
            },
            {
              id: 5,
              file: 'url5',
              position: 1,
            },
            {
              id: 6,
              file: 'url6',
              position: 2,
            },
            {
              id: 7,
              file: 'url7',
              position: 3,
            },
          ],
          averageRating: 80,
          ratingsCount: 2,
          deliveryMethod: 'delivery',
          deliveryFee: 12,
        },
      },
    },
    config: {
      currency: {
        defaultCurrencySymbol: '$SG',
      },
    },
    route: {
      params: {
        productSku: 'Product_01',
      },
    },
  },
};

const route = {
  params: {
    productSku: 'Product_01',
  },
};

jest.useRealTimers();

describe('ProductDetailsScreen', () => {
  it('should render properly', async () => {
    const screen = renderForTest(
      <ProductDetailsScreen navigation={navigation} route={route} />,
      { initialState },
    );
    const backButton = screen.getByType(BackButton);
    const productDetails = screen.getByType(ProductDetails);
    const moreDetails = screen.getByType(MoreDetail);
    const customOrder = screen.getByType(CustomOrder);
    const addToCartButton = screen.getByType(AddCartButton);
    expect(backButton).toBeDefined();
    expect(productDetails).toBeDefined();
    expect(moreDetails).toBeDefined();
    expect(customOrder).toBeDefined();
    expect(addToCartButton).toBeDefined();
  });
  it('should show Spinner when storeMap doesnt have productSku passed', () => {
    const route = {
      params: {
        productSku: 'Product_02',
      },
    };
    const screen = renderForTest(
      <ProductDetailsScreen navigation={navigation} route={route} />,
      { initialState },
    );
    const spinner = screen.getByType(Spinner);
    expect(spinner).toBeDefined();
  });


  it('SnackBar should behave properly', async () => {
    const screen = renderForTest(
      <ProductDetailsScreen navigation={navigation} route={route} />,
      { initialState },
    );
    const snackBar = screen.getByType(SnackBar);
    fireEvent(snackBar, 'snackBarHided');
    await flushMicrotasksQueue();
    expect(snackBar.props.visible).toBe(false);

    const snackView = screen.getByType(AddToCartSnackView);
    fireEvent(snackView, 'cancelPress');
    await flushMicrotasksQueue();
    expect(snackBar.props.visible).toBe(false);
    fireEvent(snackView,'containerPress');
    expect(navigation.navigate).toBeCalledWith(SHOP_CART_SCREEN)
  });

  it('Add to Cart should behave correctly', async () => {
    const screen = renderForTest(
      <ProductDetailsScreen navigation={navigation} route={route} />,
      { initialState },
    );
    await flushMicrotasksQueue();
    const snackBar = screen.getByType(SnackBar);
    const addCartButton = screen.getByType(AddCartButton);
    fireEvent(addCartButton, 'addToCartSuccess');
    await flushMicrotasksQueue();
    fireEvent(addCartButton, 'addToCartFailed');
    await flushMicrotasksQueue();
    expect(snackBar.props.visible).toBe(false);
  });
});
