import React from 'react';
import ProductDetails, { BeforeDiscountPriceText } from '../ProductDetails';
import { renderForTest } from '@testUtils';
import { Image } from '@shops/wrappers/components';

const product = {
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
    file:
      'https://shop.cxa2dev.com/media/catalog/product/cache/e9d956138de183bb4dacc5c69c32ff16/m/a/main_oo9188-7359_flak-2-0_matte-black-prizm-black_001_118342_png_heroxl_1__1.jpg',
    position: 0,
  },
  smallImage: {
    id: 0,
    file:
      'https://shop.cxa2dev.com/media/catalog/product/cache/a02e94cd3f9ce264435a3c76896595af/m/a/main_oo9188-7359_flak-2-0_matte-black-prizm-black_001_118342_png_heroxl_1__1.jpg',
    position: 0,
  },
  thumbnail: {
    id: 0,
    file:
      'https://shop.cxa2dev.com/media/catalog/product/cache/ca48c27989a3d90b22cca42748fce193/m/a/main_oo9188-7359_flak-2-0_matte-black-prizm-black_001_118342_png_heroxl_1__1.jpg',
    position: 0,
  },
  images: [
    {
      id: 4,
      file:
        'https://shop.cxa2dev.com/media/catalog/product/cache/e9d956138de183bb4dacc5c69c32ff16/m/a/main_oo9188-7359_flak-2-0_matte-black-prizm-black_001_118342_png_heroxl_1__1.jpg',
      position: 0,
    },
    {
      id: 5,
      file:
        'https://shop.cxa2dev.com/media/catalog/product/cache/e9d956138de183bb4dacc5c69c32ff16/l/d/ld2cpgnmb_2.jpg',
      position: 1,
    },
    {
      id: 6,
      file:
        'https://shop.cxa2dev.com/media/catalog/product/cache/e9d956138de183bb4dacc5c69c32ff16/l/e/le7910_2048x2048.png',
      position: 2,
    },
    {
      id: 7,
      file:
        'https://shop.cxa2dev.com/media/catalog/product/cache/e9d956138de183bb4dacc5c69c32ff16/o/a/oakley_flak_2_0_xl_replacement_lens.jpg',
      position: 3,
    },
  ],
  averageRating: 80,
  ratingsCount: 2,
  deliveryMethod: 'delivery',
  deliveryFee: 12,
};

const initialState = {
  shop: { config: { currency: { defaultCurrencySymbol: '$SG' } } },
};

describe('ProductDetails', () => {
  it('should render correctly', () => {
    const productDetails = renderForTest(<ProductDetails product={product} />, {
      initialState,
    });

    const productName = productDetails.getByText(product.name);
    const images = productDetails.getAllByType(Image);
    const description = productDetails.getByText(product.shortDescription);

    expect(productName).toBeDefined();
    expect(images.length).toEqual(1 + product.images.length);
    expect(description).toBeDefined();
  });

  it('should show special price when product have it', () => {
    const productHaveDiscountPercent = { ...product };
    productHaveDiscountPercent.discountPercent = 20;
    const productDetails = renderForTest(
      <ProductDetails product={productHaveDiscountPercent} />,
      {
        initialState,
      },
    );

    const productName = productDetails.getByText(product.name);
    const images = productDetails.getAllByType(Image);
    const description = productDetails.getByText(product.shortDescription);

    expect(productName).toBeDefined();
    expect(images.length).toEqual(1 + product.images.length);
    expect(description).toBeDefined();
  });
});
