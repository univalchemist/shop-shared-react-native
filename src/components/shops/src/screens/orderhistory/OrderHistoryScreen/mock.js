export const orderHistoryMockData = [
  {
    orderNo: 'Cxa1',
    orderDate: '2020-04-25T00:44:34',
    totalAmount: 2200,
    payment: {
      byWallet: 1200,
      byCreditCart: 1000,
    },
    deliveryFee: 5,
    items: [
      {
        id: 0,
        sku: 'string',
        quantity: 1,
        name: 'Lemon Essential Oil (Young Living)',
        vendor: 'Vendor 1',
        price: 1000,
        type: 'simple',
        deliveryFee: 5,
        status: 'Shipped',
        thumbnail: {
          id: 1,
          file:
            'https://images-na.ssl-images-amazon.com/images/I/71wGPX1Mj7L._SX466_.jpg',
          position: 0,
          label: 'string',
        },
      },
      {
        id: 1,
        sku: 'string1',
        quantity: 1,
        vendor: 'Vendor 2',
        name: 'Trial Lighter Delights (1 Day Meals)',
        price: 1200,
        type: 'simple',
        deliveryFee: 3,
        status: 'Received',
        thumbnail: {
          id: 2,
          file:
            'https://images-na.ssl-images-amazon.com/images/I/61nEd5qvmpL._SY741_.jpg',
          position: 0,
          label: 'string',
        },
      },
    ],
  },

  {
    orderNo: 'Cxa3',
    orderDate: '2020-04-24T00:44:34',
    totalAmount: 1000,
    deliveryFee: 5,
    items: [
      {
        id: 3,
        sku: 'string',
        quantity: 1,
        name: 'Lemon Essential Oil (Young Living) 1',
        price: 1000,
        vendor: 'Vendor 3',
        type: 'simple',
        deliveryFee: 7,
        status: 'Processing',
        thumbnail: {
          id: 1,
          file:
            'https://images-na.ssl-images-amazon.com/images/I/71wGPX1Mj7L._SX466_.jpg',
          position: 0,
          label: 'string',
        },
      },
    ],
  },
];

export const orderHistoryContract = {
  data: [
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
            file: 'https://images-na.ssl-images-amazon.com/images/I/71wGPX1Mj7L._SX466_.jpg',
            position: 0,
            label: 'string',
          },
        },
      ],
      orderDate: '2020-05-08T14:37:25.033Z',
    },
  ],
};

