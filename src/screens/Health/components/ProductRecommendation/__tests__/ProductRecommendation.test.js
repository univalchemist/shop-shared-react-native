import React from 'react';
import ProductRecommendation from '../';
import ProductRecommendationLoader from '../ProductRecommendationLoader';
import ProductRecommendationCard from '../ProductRecommendationCard';
import { render } from '@testUtils';
import messages from '@messages/en-HK.json';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import ProductRecommendationError from '../ProductRecommendationError';
import Carousel, { Pagination } from 'react-native-snap-carousel';

describe('Product Recommendations', () => {
  const productRecommendations = [
    {
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
    },
    {
      id: '2',
      name: 'Product 2',
      provider: 'Provider A',
      currency: 'HKD',
      price: 90.0,
      specialPrice: 9.0,
      discount: 90,
      rating: 4.5,
      reviewCount: 29,
      url:
        'https://choices.cxapalawan.com/cxadevclient1/catalog/product/view/id/2/s/roger-winbledon/?pos=2',
      imageUrl:
        'https://choices.cxapalawan.com/pub/media/catalog/product/cache/image/700x560/e9c3970ab036de70892d86c6d221abfe/r/o/roger-federer-wimbledon-sf-backhand_3323898.jpg',
    },
    {
      id: '3',
      name: 'Product 3',
      provider: 'Provider A',
      currency: 'HKD',
      price: 10.5,
      specialPrice: 9.9,
      discount: 10,
      rating: 5,
      reviewCount: 2,
      url: 'https://cxagroup.com/products/3',
      imageUrl: null,
    },
    {
      id: '4',
      name: 'Product 4',
      provider: 'Provider A',
      currency: 'HKD',
      price: 10.5,
      specialPrice: null,
      discount: 10,
      rating: 0.5,
      reviewCount: 12,
      url: 'https://cxagroup.com/products/4',
      imageUrl: 'https://someinvalid.co',
    },
  ];
  const fetchProductRecommendations = jest.fn(() =>
    Promise.resolve({
      data: productRecommendations,
    }),
  );
  const title = 'some-title';

  it('should match snapshot', async () => {
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();
    expect(screen.toJSON()).toMatchSnapshot();
    expect(screen.queryAllByType(ProductRecommendationCard).length).toBe(4);
  });

  it('should display and hide the loader', async () => {
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    expect(screen.getByType(ProductRecommendationLoader)).toBeDefined();
    await flushMicrotasksQueue();
    expect(screen.queryByType(ProductRecommendationLoader)).toBeNull();
  });

  it('should display recommendation title that was passed', async () => {
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();
    expect(screen.queryAllByText(title).length).toBe(1);
  });

  it('should display a carousel with four product recommendation cards', async () => {
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();

    const carousel = screen.queryAllByType(Carousel);
    const productRecommendationCards = screen.queryAllByType(
      ProductRecommendationCard,
    );
    expect(carousel.length).toBe(1);
    expect(productRecommendationCards.length).toBe(4);
  });

  it('should display a pagination for carousel', async () => {
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();

    const pagination = screen.queryAllByType(Pagination);
    expect(pagination.length).toBe(1);
    expect(pagination[0].props.dotsLength).toBe(4);
  });

  it('should not display the section if there are no products', async () => {
    const fetchProductRecommendations = jest.fn(() =>
      Promise.resolve({
        data: [],
      }),
    );
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={[]}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();
    expect(
      screen.queryByText(messages['health.productRecommendation.title']),
    ).toBeNull();
    expect(screen.queryByType(ProductRecommendationCard)).toBeNull();
  });

  it('should be accessible', async () => {
    const titleMessage = messages['health.productRecommendation.title'];
    const [screen] = render(
      <ProductRecommendation
        title={titleMessage}
        productRecommendations={productRecommendations}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();
    const title = screen.queryByText(titleMessage);

    expect(title.props.accessible).toBe(true);
    expect(title.props.accessibilityLabel).toBe(titleMessage);
  });

  it('should not display the section if products are null', async () => {
    const fetchProductRecommendations = jest.fn(() =>
      Promise.resolve({
        data: null,
      }),
    );
    const [screen] = render(
      <ProductRecommendation
        title={title}
        productRecommendations={[]}
        fetchProductRecommendations={fetchProductRecommendations}
      />,
    );
    await flushMicrotasksQueue();
    expect(
      screen.queryByText(messages['health.productRecommendation.title']),
    ).toBeNull();
    expect(screen.queryByType(ProductRecommendationCard)).toBeNull();
  });

  describe('when error', () => {
    it('should display error panel', async () => {
      const fetchProductRecommendations = jest.fn(() =>
        Promise.reject({
          data: null,
        }),
      );
      const [screen] = render(
        <ProductRecommendation
          title={title}
          productRecommendations={[]}
          fetchProductRecommendations={fetchProductRecommendations}
        />,
      );
      await flushMicrotasksQueue();
      expect(screen.getByType(ProductRecommendationError)).toBeDefined();
    });

    it('should pass in title to error panel', async () => {
      const fetchProductRecommendations = jest.fn(() =>
        Promise.reject({
          data: null,
        }),
      );
      const [screen] = render(
        <ProductRecommendation
          title={title}
          productRecommendations={[]}
          fetchProductRecommendations={fetchProductRecommendations}
        />,
      );
      await flushMicrotasksQueue();
      const errorPanel = screen.getByType(ProductRecommendationError);
      expect(errorPanel.props.title).toEqual(title);
    });
  });
});
