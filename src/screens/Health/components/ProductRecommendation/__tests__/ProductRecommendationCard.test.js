import React from 'react';
import { render } from '@testUtils';
import ProductRecommendationCard from '../ProductRecommendationCard';
import { Image, TouchableHighlight } from 'react-native';
import { ImageErrorCard } from '@wrappers/components';
import {
  act,
  fireEvent,
  flushMicrotasksQueue,
} from 'react-native-testing-library';
import { SHOP } from '@routes';
import uuid from 'uuid';

const navigation = {
  navigate: jest.fn(),
};
jest.mock('uuid');

describe('ProductRecommendationCard', () => {
  it('should render image, name, provider and price', () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: null,
      discount: 0,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/?pos=1',
      imageUrl:
        'https://choices.cxapalawan.com/pub/media/catalog/product/cache/image/700x560/e9c3970ab036de70892d86c6d221abfe/7/1/71wrw4r2nel._sx466_.jpg',
    };

    const [comp] = render(
      <ProductRecommendationCard product={product} navigation={navigation} />,
    );
    const image = comp.getByType(Image);
    expect(image).toBeDefined();
    expect(image.props.source.uri).toBe(product.imageUrl);
    expect(comp.getByText(product.name)).toBeDefined();
    expect(comp.getByText(product.provider)).toBeDefined();
    expect(comp.getByText('HK$ 100.00')).toBeDefined();
    expect(comp.queryByType(ImageErrorCard)).toBeNull();
  });

  it('should have accessibility attributes', () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: 90.0,
      discount: 10.0,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/?pos=1',
      imageUrl:
        'https://choices.cxapalawan.com/pub/media/catalog/product/cache/image/700x560/e9c3970ab036de70892d86c6d221abfe/7/1/71wrw4r2nel._sx466_.jpg',
    };

    const [comp] = render(
      <ProductRecommendationCard product={product} navigation={navigation} />,
    );
    const image = comp.getByType(Image);
    expect(image.props.accessible).toBe(true);
    expect(image.props.accessibilityLabel).toBe(product.name);
    const name = comp.getByText(product.name);
    expect(name.props.accessible).toBe(true);
    expect(name.props.accessibilityLabel).toBe(product.name);
    const provider = comp.getByText(product.provider);
    expect(provider.props.accessible).toBe(true);
    expect(provider.props.accessibilityLabel).toBe(product.provider);
    const regPrice = comp.getByText('HK$ 100.00');
    expect(regPrice.props.accessible).toBe(true);
    expect(regPrice.props.accessibilityLabel).toBe('HK$ 100.00');
    const specialPrice = comp.getByText('HK$ 90.00');
    expect(specialPrice.props.accessible).toBe(true);
    expect(specialPrice.props.accessibilityLabel).toBe('HK$ 90.00');
  });

  it('should render price and special price when special price is not null', () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: 1.0,
      discount: 99,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/?pos=1',
      imageUrl:
        'https://choices.cxapalawan.com/pub/media/catalog/product/cache/image/700x560/e9c3970ab036de70892d86c6d221abfe/7/1/71wrw4r2nel._sx466_.jpg',
    };

    const [comp] = render(
      <ProductRecommendationCard product={product} navigation={navigation} />,
    );
    const regPrice = comp.getByText('HK$ 100.00');
    expect(regPrice).toBeDefined();
    const { textDecorationLine } = regPrice.props.style[1];
    expect(textDecorationLine).toBe('line-through');
    expect(comp.getByText('HK$ 1.00')).toBeDefined();
  });

  it('should render image error card when imageUrl is null', () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: 1.0,
      discount: 99,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/?pos=1',
      imageUrl: null,
    };

    const [comp] = render(
      <ProductRecommendationCard product={product} navigation={navigation} />,
    );
    expect(comp.getByType(ImageErrorCard)).toBeDefined();
  });

  it('should render image error card when imageUrl cannot load', async () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: 1.0,
      discount: 99,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/?pos=1',
      imageUrl: 'http://image.that.does.not.load',
    };

    const [comp] = render(
      <ProductRecommendationCard product={product} navigation={navigation} />,
    );
    const image = comp.getByType(Image);
    act(() => {
      fireEvent(image, 'error');
    });
    await flushMicrotasksQueue();
    expect(comp.getByType(ImageErrorCard)).toBeDefined();
  });

  it('should navigate to shop product with localised URL and a dummyCounter to force rerender in shop webview', async () => {
    const product = {
      id: '1',
      name: 'Yaw Tennis Racquet',
      provider: 'Yawtennis',
      currency: 'HKD',
      price: 100.0,
      specialPrice: 1.0,
      discount: 99,
      rating: 2.0,
      reviewCount: 239,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/1/s/yaw-tennis-racquet/',
      imageUrl: 'http://image.that.does.not.load',
    };
    const productPosition = 1;
    uuid.mockImplementation(() => 'uuid');

    const [comp] = render(
      <ProductRecommendationCard
        product={product}
        productPosition={productPosition}
        navigation={navigation}
      />,
    );
    const link = comp.getByType(TouchableHighlight);
    act(() => {
      fireEvent.press(link);
    });
    await flushMicrotasksQueue();
    expect(navigation.navigate).toHaveBeenCalledWith(SHOP, {
      url: `${product.url}?rec=suggestedoffers&type=lo&pos=1/?uuid=uuid`,
    });
  });
});
