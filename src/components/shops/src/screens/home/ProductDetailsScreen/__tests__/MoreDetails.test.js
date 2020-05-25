import { renderForTest } from '@testUtils';
import MoreDetails from '../MoreDetails';
import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import navigation from '@testUtils/__mocks__/navigation';
import { Button } from '@shops/wrappers/components';
import { Icon } from 'react-native-elements';
import { SHOP_REVIEW_SCREEN } from '@shops/navigation/routes';
import { RatingStars } from '@shops/components';
import { DATE_FORMAT_SHORT } from '@shops/utils/constant';

const productMock = {
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
};

const reviewsMock = [
  {
    id: 8,
    title: 'Bob thinks product makes bob happy',
    detail: 'dfsdfsdfds',
    nickName: 'Bob Jones',
    ratings: [
      { percent: 80, ratingCode: 'Overall ratings' },
      { percent: 80, ratingCode: 'Product/Service quality' },
      { percent: 80, ratingCode: 'Purchase experience' },
      { percent: 80, ratingCode: 'Redemption experience' },
    ],
    reviewDate: '2020-04-24T07:29:31',
  },
  {
    id: 7,
    title: 'Good product',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    nickName: 'Simba',
    ratings: [
      { percent: 100, ratingCode: 'Overall ratings' },
      { percent: 80, ratingCode: 'Purchase experience' },
      { percent: 60, ratingCode: 'Product/Service quality' },
    ],
    reviewDate: '2020-04-25T00:44:34',
  },
];

const reviewsWith4Items = [
  {
    id: 8,
    title: 'Bob thinks product makes bob happy',
    detail: 'dfsdfsdfds',
    nickName: 'Bob Jones',
    ratings: [
      { percent: 80, ratingCode: 'Overall ratings' },
      { percent: 80, ratingCode: 'Product/Service quality' },
      { percent: 80, ratingCode: 'Purchase experience' },
      { percent: 80, ratingCode: 'Redemption experience' },
    ],
    reviewDate: '2020-04-24T07:29:31',
  },
  {
    id: 7,
    title: 'Good product',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    nickName: 'Simba',
    ratings: [
      { percent: 100, ratingCode: 'Overall ratings' },
      { percent: 80, ratingCode: 'Purchase experience' },
      { percent: 60, ratingCode: 'Product/Service quality' },
    ],
    reviewDate: '2020-04-25T00:44:34',
  },

  {
    id: 6,
    title: 'Good product 1',
    detail:
      'Lorem ipsum 1 dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    nickName: 'Simba1',
    ratings: [
      { percent: 90, ratingCode: 'Overall ratings' },
      { percent: 70, ratingCode: 'Purchase experience' },
      { percent: 50, ratingCode: 'Product/Service quality' },
    ],
    reviewDate: '2020-04-23T00:44:34',
  },

  {
    id: 5,
    title: 'Jones thinks product makes bob happy',
    detail: 'dfsdfsdfds',
    nickName: 'Jones Jones',
    ratings: [
      { percent: 80, ratingCode: 'Overall ratings' },
      { percent: 80, ratingCode: 'Product/Service quality' },
      { percent: 80, ratingCode: 'Purchase experience' },
      { percent: 80, ratingCode: 'Redemption experience' },
    ],
    reviewDate: '2020-04-22T07:29:31',
  },
];

const api = {
  getReviews: jest.fn(() => Promise.resolve({ data: reviewsMock })),
};

describe('MoreDetails', () => {
  it('should open section in accordion properly', async () => {
    const moreDetailsScreen = renderForTest(
      <MoreDetails product={productMock} />,
    );
    const accordion = moreDetailsScreen.getByType(Accordion);
    fireEvent(accordion, 'change', [1]);
    await flushMicrotasksQueue();
    const icons = moreDetailsScreen.getAllByType(Icon);
    expect(icons[0].props.name).toEqual('expand-more');
    expect(icons[6].props.name).toEqual('expand-less');
    fireEvent(accordion, 'change', [0]);
    await flushMicrotasksQueue();
    expect(icons[0].props.name).toEqual('expand-less');
    expect(icons[6].props.name).toEqual('expand-more');
  });

  it('should have reviews when getReviews return data', async () => {
    const moreDetailsScreen = renderForTest(
      <MoreDetails product={productMock} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const reviewTitle1 = moreDetailsScreen.getByText(reviewsMock[0].title);
    const reviewDetails1 = moreDetailsScreen.getByText(reviewsMock[0].detail);
    const reviewDate = moreDetailsScreen.getByText(
      moment(reviewsMock[0].reviewDate).format(DATE_FORMAT_SHORT),
    );

    expect(reviewTitle1).toBeDefined();
    expect(reviewDetails1).toBeDefined();
    expect(reviewDate).toBeDefined();
  });

  it('should have reviews only 2 when getReviews return data more than 2', async () => {
    const api = {
      getReviews: jest.fn(() => Promise.resolve({ data: reviewsWith4Items })),
    };
    const moreDetailsScreen = renderForTest(
      <MoreDetails product={productMock} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const ratingStars = moreDetailsScreen.getAllByType(RatingStars);
    expect(ratingStars.length).toBe(3); //one default is in header
  });

  it('should navigate to ReviewScreen when click Button', async () => {
    const moreDetailsScreen = renderForTest(
      <MoreDetails product={productMock} navigation={navigation} />,
      { api },
    );
    await flushMicrotasksQueue();
    const button = moreDetailsScreen.getByType(Button);
    fireEvent.press(button);
    expect(navigation.navigate).toHaveBeenCalledWith(SHOP_REVIEW_SCREEN, {
      productSku: productMock.sku,
      reviews: reviewsMock,
    });
  });
});
