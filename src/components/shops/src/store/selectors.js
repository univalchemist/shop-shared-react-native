import { createSelector } from 'reselect';

export const getProductMap = state => state.home.productMap;
export const getSuggestedProductSkus = state => state.home.suggestedProductSkus;
export const getGroupedProductSkus = state => state.filters.groupedProductSkus;
export const getCategories = state => state.config.categories;
export const getDeliveryAddressMap = state => state.deliveryAddress.addressMap;
export const getDeliveryAddressIds = state => state.deliveryAddress.addressIds;
export const getCountryMap = state => state.config.countryMap;
export const getCurrency = state =>
  state.shop?.config?.currency?.defaultCurrencySymbol || '';

export const getSuggestedProductsSelector = createSelector(
  [getProductMap, getSuggestedProductSkus],
  (productMap, suggestedProductSkus) => {
    return suggestedProductSkus.map(sku => productMap[sku]);
  },
);

export const getGroupedProductsSelector = createSelector(
  [getCategories, getGroupedProductSkus, getProductMap],
  (categories, groupedProductSkus, productMap) => {
    return Object.keys(groupedProductSkus).map(categoryId => ({
      title: categories.find(c => c.value === categoryId.toString())?.label,
      data: [groupedProductSkus[categoryId].map(sku => productMap[sku])],
      categoryId,
    }));
  },
);

export const getSymbolCurrencySelector = createSelector(
  [getCurrency],
  currencySymbol => currencySymbol,
);

export const getDeliveryAddressesSelector = createSelector(
  [getDeliveryAddressMap, getDeliveryAddressIds, getCountryMap],
  (addressMap, addressIds, countryMap) => {
    return addressIds.map(id => {
      const address = addressMap[id];
      return {
        ...address,
        country: countryMap[address.countryId],
      };
    });
  },
);
