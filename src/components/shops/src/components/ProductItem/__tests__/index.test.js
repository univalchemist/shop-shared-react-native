import React from 'react';
import { render } from '@testUtils';
import ProductItem from '../index';
import { TouchableHighlight } from 'react-native';
import { act, fireEvent } from 'react-native-testing-library';

const productMock = {
  id: 10,
  sku: 'Product_10',
  name: 'Product 10',
  attribute_set_id: 4,
  price: 590,
  status: 1,
  visibility: 4,
  type_id: 'simple',
  created_at: '2020-03-31 12:34:10',
  updated_at: '2020-03-31 12:34:10',
  extension_attributes: {
    website_ids: [1],
    category_links: [
      { position: 0, category_id: '2' },
      { position: 0, category_id: '3' },
    ],
  },
  product_links: [],
  options: [],
  media_gallery_entries: [],
  tier_prices: [],
  custom_attributes: [
    { attribute_code: 'options_container', value: 'container2' },
    { attribute_code: 'msrp_display_actual_price_type', value: '0' },
    { attribute_code: 'url_key', value: 'product-10' },
    { attribute_code: 'gift_message_available', value: '2' },
    { attribute_code: 'required_options', value: '0' },
    { attribute_code: 'has_options', value: '0' },
    { attribute_code: 'meta_title', value: 'Product 10' },
    { attribute_code: 'meta_keyword', value: 'Product 10' },
    { attribute_code: 'tax_class_id', value: '2' },
    { attribute_code: 'ts_packaging_type', value: 'none' },
    { attribute_code: 'category_ids', value: ['2', '3'] },
    {
      attribute_code: 'description',
      value:
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
    },
    {
      attribute_code: 'short_description',
      value:
        '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>',
    },
  ],
};

describe('ProductItem', () => {
  it('should render image, name, provider and price', () => {
    const onPress = jest.fn();
    const [comp] = render(
      <ProductItem product={productMock} onPress={onPress} />,
    );
    expect(comp.getByText(productMock.name)).toBeDefined();
    const button = comp.getByType(TouchableHighlight);
    act(() => {
      fireEvent.press(button);
    });
    expect(onPress).toHaveBeenCalledWith(productMock);
  });
});
