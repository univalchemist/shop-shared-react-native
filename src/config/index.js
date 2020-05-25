import AppConfig from 'react-native-config';

const { SERVER_HOST } = AppConfig;

const AUTH_HOST = SERVER_HOST + '/auth';
const BENEFIT_HOST = SERVER_HOST + '/benefit';
const CLAIM_HOST = SERVER_HOST + '/claim';
const CONTENT_HOST = SERVER_HOST + '/content';
const MEMBER_HOST = SERVER_HOST + '/member';
const PANEL_HOST = SERVER_HOST + '/panel';
const WALLET_HOST = SERVER_HOST + '/wallet';
const WELLNESS_HOST = SERVER_HOST + '/wellness';
const RECOMMENDATION_HOST = SERVER_HOST + '/recommendation';
const PAYMENT = SERVER_HOST + '/payment';

const Config = {
  AUTH_HOST,
  WELLNESS_HOST,
  WALLET_HOST,
  apiRoutes: {
    /* AUTH */
    login: `${AUTH_HOST}/api/v1/oauth/token`,
    register: clientId =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/users/register`,
    forgotPassword: clientId =>
      `${AUTH_HOST}/api/v2/clients/${clientId}/users/forgot-password`,
    resendEmail: (clientId, userId) =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/users/${userId}/request-verification`,

    getClaim: (clientId, userId, claimId) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/users/${userId}/claims/${claimId}`,
    getClaims: (clientId, userId, filters = '') =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/users/${userId}/claims?${filters}`,
    postClaims: (clientId, userId) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/users/${userId}/claims`,
    getClaimDocument: (clientId, userId, documentId) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/users/${userId}/claim/documents/${documentId}`,
    postUploadClaimDocument: (clientId, userId, type) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/users/${userId}/claim/documents/${type}`,
    getDocuments: clientId =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/documents`,
    getDocument: (clientId, documentId) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/documents/${documentId}`,
    getClaimTypes: (clientId, userId) =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/claimtypes`,
    getClaimFilters: clientId =>
      `${CLAIM_HOST}/api/v1/clients/${clientId}/filters`,
    getBalance: (clientId, memberId) =>
      `${PAYMENT}/api/v1/clients/${clientId}/users/${memberId}/balance`,

    /* HEALTH */
    getUserHealthScore: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/healthscore`,
    getUserHealthScoreHistory: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/healthscorehistory`,
    uploadFaceAgingPhoto: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/faceaging/image`,
    getUserFaceAgingResults: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/faceaging/results`,
    getUserFaceAgingResultImage: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/faceaging/results/image`,
    downloadFaceAgingPhoto: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/faceaging/image`,
    deleteFaceAgingPhoto: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/faceaging/image`,
    getUserLifestyleResponse: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/lifestyleresponse`,
    postUserLifestyleResponse: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/lifestyleresponse`,
    getUserLifestyleResults: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/lifestyleresults`,
    getLifestyleTips: (clientId, userId) =>
      `${WELLNESS_HOST}/api/v1/clients/${clientId}/users/${userId}/lifestyletips`,

    /* SHOP */

    /* RECOMMENDATION */
    getProductRecommendations: (clientId, userId) =>
      `${RECOMMENDATION_HOST}/api/v1/clients/${clientId}/users/${userId}/recommendations`,
    getProductRecommendationsForTips: (clientId, userId, tipCategory) =>
      `${RECOMMENDATION_HOST}/api/v1/clients/${clientId}/users/${userId}/recommendations?risk=${tipCategory}`,

    /* PROFILE */

    fetchMemberProfile: (clientId, userId) =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/users/${userId}/profile`,
    fetchBenefits: (clientId, userId) =>
      `${BENEFIT_HOST}/api/v1/clients/${clientId}/users/${userId}/Benefits`,
    fetchPolicyDetails: (clientId, userId) =>
      `${BENEFIT_HOST}/api/v1/clients/${clientId}/users/${userId}/policyDetails`,
    fetchHealthCards: (clientId, userId) =>
      `${BENEFIT_HOST}/api/v1/clients/${clientId}/users/${userId}/healthcards`,
    fetchWallet: (clientId, userId) =>
      `${WALLET_HOST}/api/v1/clients/${clientId}/users/${userId}/wallet/externalwallet`,
    fetchHelpContent: clientId =>
      `${CONTENT_HOST}/api/v1/clients/${clientId}/help`,
    fetchContactContent: clientId =>
      `${CONTENT_HOST}/api/v1/clients/${clientId}/contact`,
    updateMemberProfile: (clientId, userId) =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/users/${userId}/profile`,
    sendInvitationToDependent: ({ clientId, employeeId, dependentId }) =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/employees/${employeeId}/dependents/${dependentId}/invitation`,
    updateDependentDoB: ({ clientId, employeeId }) =>
      `${MEMBER_HOST}/api/v1/clients/${clientId}/users/${employeeId}/profile`,

    /* Panel Clinics */
    fetchPanelClinics: (clientId, userId) =>
      `${PANEL_HOST}/api/v1/clients/${clientId}/users/${userId}/Panels`,

    /* Legal */
    fetchTermsAndConditions: locale =>
      `${CONTENT_HOST}/api/v1/legal/terms-conditions${
        locale ? `?${locale}` : ''
      }`,
    fetchMyWellnessNewsletter: locale =>
      `${CONTENT_HOST}/api/v1/legal/wellness-newsletter-agreement${
        locale ? `?${locale}` : ''
      }`,
    fetchPrivacyPolicy: () => `${CONTENT_HOST}/api/v1/legal/privacy-policy`,
  },
};

export default Config;
