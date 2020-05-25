import React from 'react';
import { renderForTest } from '@testUtils';
import OrderHistoryScreen from '../index';
import { Spinner } from '@shops/components';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { TrackedButton } from '@shops/wrappers/components';
import { ORDER_HISTORY_DETAIL_SCREEN } from '@shops/navigation/routes';

const mockOrderHistory = [
  {
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
  },
];

const initialState = {
  shop: {
    orderHistory: {
      orderHistory: mockOrderHistory,
    },
  },
};

const api = {
  getOrdersHistory: jest.fn(() => Promise.resolve({ data: mockOrderHistory })),
};

describe('OrderHistoryScreen', () => {
  it('should render properly', async () => {
    const Comp = renderForTest(<OrderHistoryScreen />, { initialState, api });
    await flushMicrotasksQueue();
    expect(Comp.queryByText('Order History')).toBeTruthy();
    expect(Comp.queryByText('Order No. : CXA3333')).toBeTruthy();
    expect(Comp.queryByText('Total (3 items)')).toBeTruthy();
    expect(Comp.queryByText('$ 1,200.00')).toBeTruthy();
    expect(Comp.queryByText('Lemon Essential Oil (Young Living)')).toBeTruthy();
    expect(Comp.queryByText('Qty: 1')).toBeTruthy();
  });

  it('should render button properly', async () => {
    const navigation = { navigate: jest.fn() };
    const Comp = renderForTest(<OrderHistoryScreen navigation={navigation} />, {
      initialState,
      api,
    });
    await flushMicrotasksQueue();
    const button = Comp.queryByType(TrackedButton);
    expect(button.props.title).toEqual('View order details');
    fireEvent.press(button);
    expect(navigation.navigate).toBeCalledWith(ORDER_HISTORY_DETAIL_SCREEN, {
      orderHistory: mockOrderHistory[0],
    });
  });
});
