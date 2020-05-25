import React from 'react';
import { renderForTest } from '@testUtils';
import OrderHistoryDetailScreen from '../index';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { ImageProduct } from '@shops/components';
import { TrackedButton } from '@shops/wrappers/components';
import {
  TRACK_ORDER_SCREEN,
  WRITE_REVIEW_SCREEN,
} from '@shops/navigation/routes';

const mock = {
  grandTotal: 1200,
  subTotal: 0,
  discount: 0,
  shipping: 12,
  tax: 0,
  shippingTax: 0,
  subtotalIncludingTax: 0,
  shippingIncludingTax: 0,
  currency: '$',
  status: 0,
  orderId: '3333',
  orderIdText: 'CXA3333',
  itemCount: 3,
  payment: {
    grandTotal: 1150,
    method: 'string',
  },
  items: [
    {
      id: 0,
      quantity: 1,
      total: 500,
      sku: 'sku1',
      name: 'Lemon Essential Oil (Young Living)',
      description: 'string',
      thumbnail: {
        id: 0,
        file:
          'https://images-na.ssl-images-amazon.com/images/I/71wGPX1Mj7L._SX466_.jpg',
        position: 0,
        label: 'string',
      },
    },
  ],
  orderDate: '2020-05-08T14:37:25.033Z',
};

const api = {
  getOrderDetail: jest.fn(() => Promise.resolve({ data: mock })),
};
describe('OrderHistoryDetailScreen', () => {
  it('should render text properly', async () => {
    const route = { params: { orderHistory: mock } };
    const Comp = renderForTest(<OrderHistoryDetailScreen route={route} />, {
      api,
    });
    await flushMicrotasksQueue();
    expect(Comp.queryByText('Order No. : CXA3333')).toBeTruthy();
    expect(Comp.queryByText('08 May 2020')).toBeTruthy();
    expect(Comp.queryByText('Total (3 items)')).toBeTruthy();
    expect(Comp.queryByText('Delivery or self collection')).toBeTruthy();
    expect(Comp.queryByText('Payment summary')).toBeTruthy();
    expect(Comp.queryByText('Payment by credit card')).toBeTruthy();
    expect(Comp.queryByText('incl. Delivery ($ 12.00)')).toBeTruthy();
  });

  it('buttons should render and behave properly', async () => {
    const navigation = { navigate: jest.fn() };
    const route = { params: { orderHistory: mock } };
    const Comp = renderForTest(
      <OrderHistoryDetailScreen route={route} navigation={navigation} />,
      {
        api,
      },
    );
    await flushMicrotasksQueue();
    const buttons = Comp.queryAllByType(TrackedButton);
    expect(buttons[0].props.title).toEqual('Track order');
    expect(buttons[1].props.title).toEqual('Write a review');
    fireEvent.press(buttons[0]);
    expect(navigation.navigate).toBeCalledWith(TRACK_ORDER_SCREEN);
    fireEvent.press(buttons[1]);
    expect(navigation.navigate).toBeCalledWith(WRITE_REVIEW_SCREEN, {
      boughtProduct: mock.items[0],
    });
  });
});
