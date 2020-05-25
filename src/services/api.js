import axios from 'axios';
import Config from '@config';
import { fetchTokens } from '@services/secureStore';
import RNConfig from 'react-native-config';
import * as shopApis from '@shops/services/api';

const getAuthHeaders = async () => {
  const { access_token } = await fetchTokens();
  return { Authorization: `Bearer ${access_token}` };
};

const getApi = async (url, options = { headers: {} }) => {
  const authHeaders = await getAuthHeaders();

  return axios.get(url, {
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

const postFileDataApi = async (
  url,
  { uri, type, fileName },
  options = { headers: {}, field: 'image' },
) => {
  const bodyFormData = new FormData();
  bodyFormData.append(options.field, {
    uri,
    type,
    name: fileName,
  });
  const authHeaders = await getAuthHeaders();

  return axios.post(url, bodyFormData, {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
      'content-type': 'multipart/form-data',
    },
  });
};

/* Endpoint definitions */
/* User Login */
const login = ({ clientId, username, password }) =>
  axios.post(Config.apiRoutes.login, {
    clientId,
    username,
    password,
  });

const forgotPassword = ({ clientId, username: emailId }) =>
  axios.post(Config.apiRoutes.forgotPassword(clientId), { clientId, emailId });

const resendEmail = (clientId, userId) =>
  postApi(Config.apiRoutes.resendEmail(clientId, userId));

/* Health */
const downloadFaceAgingPhoto = (clientId, userId) =>
  getApi(Config.apiRoutes.downloadFaceAgingPhoto(clientId, userId), {
    responseType: 'arraybuffer',
  });

const getUserHealthScore = (clientId, userId) =>
  getApi(Config.apiRoutes.getUserHealthScore(clientId, userId));

const getUserHealthScoreHistory = (clientId, userId) =>
  getApi(Config.apiRoutes.getUserHealthScoreHistory(clientId, userId));

const getUserLifestyleResponse = (clientId, userId) =>
  getApi(Config.apiRoutes.getUserLifestyleResponse(clientId, userId));

const submitUserLifestyleResponse = (clientId, userId, lifestyleData) => {
  return postApi(
    Config.apiRoutes.postUserLifestyleResponse(clientId, userId),
    lifestyleData,
  );
};

const getUserLifestyleResults = (clientId, userId) =>
  getApi(Config.apiRoutes.getUserLifestyleResults(clientId, userId));

const getLifestyleTips = (clientId, userId) =>
  getApi(Config.apiRoutes.getLifestyleTips(clientId, userId));

const uploadFaceAgingPhoto = (clientId, userId, image) =>
  postFileDataApi(
    Config.apiRoutes.uploadFaceAgingPhoto(clientId, userId),
    image,
  );

const getUserFaceAgingResults = (clientId, userId) =>
  getApi(Config.apiRoutes.getUserFaceAgingResults(clientId, userId));

const getUserFaceAgingResultImage = (clientId, userId, age, category) =>
  getApi(
    `${Config.apiRoutes.getUserFaceAgingResultImage(
      clientId,
      userId,
    )}?age=${age}&category=${category}`,
    { responseType: 'arraybuffer' },
  );

const deleteFaceAgingPhoto = (clientId, userId) =>
  deleteApi(Config.apiRoutes.deleteFaceAgingPhoto(clientId, userId));

const getProductRecommendations = (clientId, userId) =>
  getApi(Config.apiRoutes.getProductRecommendations(clientId, userId));

const getProductRecommendationsForTips = (clientId, userId, tipCategory) =>
  getApi(
    Config.apiRoutes.getProductRecommendationsForTips(
      clientId,
      userId,
      tipCategory,
    ),
  );

/* Claims */
const getClaimTypes = (clientId, userId) =>
  getApi(Config.apiRoutes.getClaimTypes(clientId, userId));

const getClaim = (clientId, userId, claimId) =>
  getApi(Config.apiRoutes.getClaim(clientId, userId, claimId));

const getClaims = (clientId, userId, filters = '') =>
  getApi(Config.apiRoutes.getClaims(clientId, userId, filters));

const getClaimFilters = clientId =>
  getApi(Config.apiRoutes.getClaimFilters(clientId));

const submitClaim = (clientId, userId, values) =>
  postApi(Config.apiRoutes.postClaims(clientId, userId), values);

const uploadDocumentReference = (clientId, userId, documentType, fileData) =>
  postFileDataApi(
    Config.apiRoutes.postUploadClaimDocument(clientId, userId, documentType),
    fileData,
    { field: 'document' },
  );

const getDocuments = clientId =>
  getApi(Config.apiRoutes.getDocuments(clientId));

/* Profile */

const fetchMemberProfile = (clientId, userId) =>
  getApi(Config.apiRoutes.fetchMemberProfile(clientId, userId));

const fetchBenefits = (clientId, userId) =>
  getApi(Config.apiRoutes.fetchBenefits(clientId, userId));

const getMemberBalance = (clientId, memberId) =>
  getApi(Config.apiRoutes.getBalance(clientId, memberId));

const fetchPolicyDetails = (clientId, userId) =>
  getApi(Config.apiRoutes.fetchPolicyDetails(clientId, userId));

const fetchHealthCards = (clientId, userId) =>
  getApi(Config.apiRoutes.fetchHealthCards(clientId, userId));

const fetchHelpContent = (clientId, locale) =>
  getApi(Config.apiRoutes.fetchHelpContent(clientId, locale));

const fetchContactContent = (clientId, locale) =>
  getApi(Config.apiRoutes.fetchContactContent(clientId, locale));

const fetchWallet = ({ clientId, userId }) =>
  getApi(Config.apiRoutes.fetchWallet(clientId, userId));

const fetchPanelClinics = (clientId, userId) =>
  getApi(Config.apiRoutes.fetchPanelClinics(clientId, userId));

const updateMemberProfile = (clientId, userId, memberProfile) =>
  putApi(Config.apiRoutes.updateMemberProfile(clientId, userId), memberProfile);

const sendInvitationToDependent = ({
  clientId,
  employeeId,
  dependentId,
  emailId,
}) =>
  postApi(
    Config.apiRoutes.sendInvitationToDependent({
      clientId,
      employeeId,
      dependentId,
    }),
    {
      emailId,
    },
  );

const updateDependentDoB = ({
  clientId,
  employeeId,
  dependentId,
  dateOfBirth,
}) =>
  putApi(Config.apiRoutes.updateDependentDoB({ clientId, employeeId }), {
    clientId,
    dateOfBirth,
    memberId: dependentId,
  });

/* Legal */
const getTermsAndConditions = locale =>
  locale
    ? getApi(Config.apiRoutes.fetchTermsAndConditions(locale), {
        headers: {
          'Accept-Language': locale,
        },
      })
    : getApi(Config.apiRoutes.fetchTermsAndConditions(locale));

const getMyWellnessNewsletter = locale =>
  locale
    ? getApi(Config.apiRoutes.fetchMyWellnessNewsletter(locale), {
        headers: {
          'Accept-Language': locale,
        },
      })
    : getApi(Config.apiRoutes.fetchMyWellnessNewsletter(locale));

const getPrivacyPolicy = () => getApi(Config.apiRoutes.fetchPrivacyPolicy());

export default {
  login,
  forgotPassword,
  resendEmail,
  getAuthHeaders,
  fetchMemberProfile,
  getMemberBalance,
  getClaimTypes,
  getClaim,
  getClaims,
  getDocuments,
  getUserHealthScore,
  getUserHealthScoreHistory,
  uploadDocumentReference,
  submitClaim,
  getClaimFilters,
  getUserFaceAgingResults,
  getUserFaceAgingResultImage,
  uploadFaceAgingPhoto,
  fetchBenefits,
  fetchPolicyDetails,
  fetchHealthCards,
  fetchHelpContent,
  fetchContactContent,
  fetchWallet,
  downloadFaceAgingPhoto,
  deleteFaceAgingPhoto,
  getProductRecommendations,
  getProductRecommendationsForTips,
  fetchPanelClinics,
  getUserLifestyleResponse,
  submitUserLifestyleResponse,
  getUserLifestyleResults,
  updateMemberProfile,
  updateDependentDoB,
  sendInvitationToDependent,
  getTermsAndConditions,
  getMyWellnessNewsletter,
  getPrivacyPolicy,
  getLifestyleTips,
  ...shopApis,
};
