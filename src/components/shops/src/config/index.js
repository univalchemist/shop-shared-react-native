import AppConfig from 'react-native-config';
import { buildProductsUrl } from '@shops/helper/url';

const { SERVER_HOST } = AppConfig;

// const clientId = 'cxa2-dev';

// const SERVER_HOST = 'https://api.cxa2dev.com';
const SHOP_HOST = SERVER_HOST + '/shop';
const Config = {
  apiRoutes: {
    getSuggestedOffers: (clientId, page, pageSize) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/categories/suggested/products?page=${page}&pageSize=${pageSize}`,
    getReviews: (clientId, productId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/reviews/${productId}`,
    addToCart: (clientId, userId, sku, quantity) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart/items?sku=${sku}&quantity=${quantity}`,
    getStoreConfigs: clientId =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/store/configs`,
    getCategories: clientId =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/categories`,
    getSortings: clientId =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/products/sorting`,
    getCountries: clientId =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/store/countries`,
    getProducts: (clientId, params) => {
      //this api not grouped category
      const path = `${SHOP_HOST}/api/v1/clients/${clientId}/products`;

      return buildProductsUrl(path, params);
    },
    getProductsGroupedCategories: (clientId, params) => {
      //this api for grouped category
      const path = `${SHOP_HOST}/api/v1/clients/${clientId}/products/aggregatedcategories`;
      return buildProductsUrl(path, params);
    },
    getProductsByCategoryId: (clientId, categoryId, params) => {
      const path = `${SHOP_HOST}/api/v1/clients/${clientId}/categories/${categoryId}/products`;

      return buildProductsUrl(path, params);
    },
    getProductBySku: (clientId, sku) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/products/${sku}`,
    getCart: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart`,
    getCartTotals: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart/totals`,
    getCartBilling: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart/billing`,
    getCartShipping: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart/shipping`,
    removeItemFromCart: (clientId, userId, sku) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/cart/items/${sku}`,
    getOrdersHistory: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/orders`,
    getOrderDetail: (clientId, userId, orderId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/orders/${orderId}`,
    getTrackOrder: (clientId, userId, orderId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/orders/${orderId}/track`,
    getReviewForm: clientId =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/reviews/form`,
    postReview: (clientId, userId, orderId, sku) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/orders/${orderId}/items/${sku}/review`,
    deliveryAddresses: (clientId, userId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/addresses`,
    deliveryAddressById: (clientId, userId, addressId) =>
      `${SHOP_HOST}/api/v1/clients/${clientId}/users/${userId}/addresses/${addressId}`,
  },
};

export default Config;
