import * as selectors from '../selectors';

describe('Selectors', () => {
  it('should return productMap when call getProductMap', () => {
    const state = {
      home: {
        productMap: {
          sku_1: {
            name: 'Product',
          },
        },
      },
    };

    expect(selectors.getProductMap(state)).toEqual({
      sku_1: {
        name: 'Product',
      },
    });
  });

  it('should return suggestedProductSkus when call getSuggestedProductSkus', () => {
    const state = {
      home: {
        suggestedProductSkus: ['sku_1', 'sku_3', 'sku_5'],
      },
    };

    expect(selectors.getSuggestedProductSkus(state)).toEqual([
      'sku_1',
      'sku_3',
      'sku_5',
    ]);
  });

  it('should return groupedProductSkus when call getGroupedProductSkus', () => {
    const state = {
      filters: {
        groupedProductSkus: {
          1: ['sku_1', 'sku_3', 'sku_5'],
        },
      },
    };

    expect(selectors.getGroupedProductSkus(state)).toEqual({
      1: ['sku_1', 'sku_3', 'sku_5'],
    });
  });

  it('should return categories when call getCategories', () => {
    const state = {
      config: {
        categories: [{ value: '1', label: 'All products' }],
      },
    };

    expect(selectors.getCategories(state)).toEqual([
      { value: '1', label: 'All products' },
    ]);
  });

  it('should return suggestedProducts when call getSuggestedProductsSelector', () => {
    const state = {
      home: {
        productMap: {
          sku_1: {
            name: 'Product 1',
          },
          sku_2: {
            name: 'Product 2',
          },
        },
        suggestedProductSkus: ['sku_1'],
      },
    };

    expect(selectors.getSuggestedProductsSelector(state)).toEqual([
      {
        name: 'Product 1',
      },
    ]);
  });

  it('should return groupedProducts when call getGroupedProductsSelector', () => {
    const state = {
      home: {
        productMap: {
          sku_1: {
            name: 'Product 1',
          },
          sku_2: {
            name: 'Product 2',
          },
        },
      },
      filters: {
        groupedProductSkus: {
          1: ['sku_2'],
        },
      },
      config: {
        categories: [{ value: '1', label: 'All products' }],
      },
    };

    expect(selectors.getGroupedProductsSelector(state)).toEqual([
      {
        categoryId: '1',
        data: [
          [
            {
              name: 'Product 2',
            },
          ],
        ],
        title: 'All products',
      },
    ]);
  });

  it('should return currency', () => {
    const state = {
      shop: {
        config: {
          currency: {
            defaultCurrencySymbol: 'S$',
          },
        },
      },
    };

    expect(selectors.getSymbolCurrencySelector(state)).toEqual('S$');
    expect(selectors.getSymbolCurrencySelector({})).toEqual('');
  });

  it('should return address with country mapped inside', () => {
    const state = {
      deliveryAddress: {
        addressMap: {
          1: {
            street: ['Address 1 line 1'],
            countryId: 'SG',
          },
          2: {
            street: ['Address 2 line 1'],
            countryId: 'SG',
          },
          3: {
            street: ['Address 3 line 1'],
            countryId: 'SG',
          },
        },
        addressIds: [1, 2],
      },
      config: {
        countryMap: {
          SG: {
            name: 'Singapore',
          },
        },
      },
    };

    expect(selectors.getDeliveryAddressesSelector(state)).toEqual([
      {
        street: ['Address 1 line 1'],
        countryId: 'SG',
        country: {
          name: 'Singapore',
        },
      },
      {
        street: ['Address 2 line 1'],
        countryId: 'SG',
        country: {
          name: 'Singapore',
        },
      },
    ]);
  });
});
