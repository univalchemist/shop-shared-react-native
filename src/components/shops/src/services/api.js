import axios from 'axios';
import Config from '@shops/config';
import { fetchTokens } from '@services/secureStore';
import { GET_TRACK_ORDER } from '@shops/__mocks__/data';

const getAuthHeaders = async () => {
  const { access_token } = await fetchTokens();
  return { Authorization: `Bearer ${access_token}` };
};

const getApi = async (url, options = { headers: {} }) => {
  const authHeaders = await getAuthHeaders();
  console.log('get api url:::', url);
  return axios.get(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};

const postApi = async (url, values, options = { headers: {} }) => {
  const authHeaders = await getAuthHeaders();

  return axios.post(url, values, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};

const putApi = async (url, values, options = { headers: {} }) => {
  const authHeaders = await getAuthHeaders();

  return axios.put(url, values, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};

const deleteApi = async (url, options = { headers: {} }) => {
  const authHeaders = await getAuthHeaders();

  return axios.delete(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });
};

const getSuggestedOffers = ({ clientId, page = 1, pageSize = 6 }) =>
  getApi(Config.apiRoutes.getSuggestedOffers(clientId, page, pageSize));

const getReviews = ({ clientId, productId }) =>
  getApi(Config.apiRoutes.getReviews(clientId, productId));

const getStoreConfigs = clientId =>
  getApi(Config.apiRoutes.getStoreConfigs(clientId));

const getCategories = clientId =>
  getApi(Config.apiRoutes.getCategories(clientId));

const getSortings = clientId => getApi(Config.apiRoutes.getSortings(clientId));

const getCountries = clientId =>
  getApi(Config.apiRoutes.getCountries(clientId));

const getProducts = (clientId, params) =>
  getApi(Config.apiRoutes.getProductsGroupedCategories(clientId, params));

const getProductsByCategoryId = (clientId, categoryId, params) =>
  getApi(
    Config.apiRoutes.getProductsByCategoryId(clientId, categoryId, params),
  );

const addToCart = ({ clientId, userId, sku, quantity = 1 }) =>
  postApi(Config.apiRoutes.addToCart(clientId, userId, sku, quantity));

const getCart = (clientId, userId) =>
  getApi(Config.apiRoutes.getCart(clientId, userId));

const getCartTotals = (clientId, userId) =>
  getApi(Config.apiRoutes.getCartTotals(clientId, userId));

const getCartBilling = (clientId, userId) =>
  getApi(Config.apiRoutes.getCartBilling(clientId, userId));

const getCartShipping = (clientId, userId) =>
  getApi(Config.apiRoutes.getCartShipping(clientId, userId));

const removeItemFromCart = (clientId, userId, sku) =>
  deleteApi(Config.apiRoutes.removeItemFromCart(clientId, userId, sku));

const getProductBySku = (clientId, sku) =>
  getApi(Config.apiRoutes.getProductBySku(clientId, sku));

const getOrdersHistory = ({ clientId, userId }) =>
  getApi(Config.apiRoutes.getOrdersHistory(clientId, userId));

const getOrderDetail = ({ clientId, userId, orderId }) =>
  getApi(Config.apiRoutes.getOrderDetail(clientId, userId, orderId));

const getTrackOrder = ({ clientId, userId, orderId }) =>
  // Promise.resolve({ data: GET_TRACK_ORDER });
  getApi(Config.apiRoutes.getTrackOrder(clientId, userId, orderId));

const getReviewForm = ({ clientId }) =>
  getApi(Config.apiRoutes.getReviewForm(clientId));

const postReview = ({ clientId, userId, orderId, sku, body }) =>
  postApi(Config.apiRoutes.postReview(clientId, userId, orderId, sku), body);

const getDeliveryAddresses = (clientId, userId) =>
  getApi(Config.apiRoutes.deliveryAddresses(clientId, userId));

const addDeliveryAddress = (clientId, userId, addressData) =>
  postApi(Config.apiRoutes.deliveryAddresses(clientId, userId), addressData);

const deleteDeliveryAddress = (clientId, userId, addressId) =>
  deleteApi(Config.apiRoutes.deliveryAddressById(clientId, userId, addressId));

const updateDeliveryAddress = (clientId, userId, addressId, addressData) =>
  putApi(
    Config.apiRoutes.deliveryAddressById(clientId, userId, addressId),
    addressData,
  );

export default {
  getSuggestedOffers,
  getStoreConfigs,
  getCategories,
  getSortings,
  getCountries,
  getReviews,
  getReviewForm,
  addToCart,
  getProducts,
  getProductsByCategoryId,
  getCart,
  getCartTotals,
  getCartBilling,
  getCartShipping,
  removeItemFromCart,
  getProductBySku,
  getOrdersHistory,
  getOrderDetail,
  getTrackOrder,
  postReview,
  getDeliveryAddresses,
  addDeliveryAddress,
  deleteDeliveryAddress,
  updateDeliveryAddress,
};
