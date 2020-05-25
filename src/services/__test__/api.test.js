import * as axios from 'axios';
import Config from '@config';
import api from '../api';

jest.mock('@store/configureStore', () => ({
  getStore: jest.fn(() => ({
    getState: jest.fn(() => ({
      user: {
        data: {
          username: 'test@test.com',
        },
      },
    })),
  })),
}));

jest.mock('@services/secureStore', () => ({
  fetchTokens: jest.fn(() => ({
    id_token: 'myidtoken',
    access_token: 'myaccesstoken',
  })),
}));

jest.mock('axios');

const FormDataMock = () => ({
  append: jest.fn(),
});

global.FormData = FormDataMock;

describe('Login Api testing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should test login api call', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { status: 'success' },
    });
    await api.login({
      clientId: 'twclient3',
      username: 'test',
      password: 'test',
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(Config.apiRoutes.login, {
      clientId: 'twclient3',
      password: 'test',
      username: 'test',
    });
  });
});

describe('forgotPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call axios.post with the correct URL and params', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { status: 'success' },
    });
    await api.forgotPassword({
      clientId: 'twclient3',
      username: 'a@b.com',
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.forgotPassword('twclient3'),
      {
        emailId: 'a@b.com',
        clientId: 'twclient3',
      },
    );
  });
});

describe('Wallet Api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call wallet api and fetch wallet', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: { status: 'success' },
    });
    const clientId = 'twclient3';
    const userId = '12';
    await api.fetchWallet({ clientId, userId });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchWallet(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('submitClaim', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call POST upload claim details with correct arguments', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const values = {};
    await api.submitClaim('twclient3', 'testuser', values);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.postClaims('twclient3', 'testuser'),
      values,
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('uploadDocumentReference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call POST upload claim document with correct arguments', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const fileData = { uri: 'test' };
    await api.uploadDocumentReference(
      'twclient3',
      'testuser',
      'Receipt',
      fileData,
    );
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.postUploadClaimDocument(
        'twclient3',
        'testuser',
        'Receipt',
      ),
      expect.anything(),
      {
        field: 'document',
        headers: {
          Authorization: 'Bearer myaccesstoken',
          'content-type': 'multipart/form-data',
        },
      },
    );
  });
});

describe('uploadFaceAgingPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call POST users faceaging image', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const image = { uri: 'test' };
    await api.uploadFaceAgingPhoto('twclient3', 'testuser', image);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.uploadFaceAgingPhoto('twclient3', 'testuser'),
      expect.anything(),
      {
        field: 'image',
        headers: {
          Authorization: 'Bearer myaccesstoken',
          'content-type': 'multipart/form-data',
        },
      },
    );
  });
});

describe('deleteFaceAgingPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call DELETE face aging photo with correct arguments', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 555;
    const userId = 666;
    await api.deleteFaceAgingPhoto(clientId, userId);
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      Config.apiRoutes.deleteFaceAgingPhoto(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('downloadFaceAgingPhoto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET download face aging photo with correct arguments', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 555;
    const userId = 666;
    await api.downloadFaceAgingPhoto(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.deleteFaceAgingPhoto(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
        responseType: 'arraybuffer',
      },
    );
  });
});

describe('fetchPanelClinics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET fetch panel clinics with correct arguments', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 555;
    const userId = 666;
    await api.fetchPanelClinics(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchPanelClinics(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchHelpContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET help', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    await api.fetchHelpContent(clientId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchHelpContent(clientId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchContactContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET help', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    await api.fetchContactContent(clientId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchContactContent(clientId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchBenefits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET user benefits', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.fetchBenefits(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchBenefits(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchPolicyDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET user policy details', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.fetchPolicyDetails(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchPolicyDetails(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchHealthCards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET user health card information', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.fetchHealthCards(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchHealthCards(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('fetchMemberProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users profile', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.fetchMemberProfile(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchMemberProfile(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('updateMemberProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call PUT update Member Profile with correct arguments', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    const memberProfile = {
      clientId: 'twclient3',
      memberId: 'testuser',
      identificationNumber: 'S111',
      fullName: 'John Doe',
      externalId: '0000123',
      role: 'Employee',
      employeeProfile: null,
      dependentRelationships: [],
      employeeRelationship: null,
      preferredLocale: 'en-HK',
    };
    await api.updateMemberProfile('twclient3', 'testuser', memberProfile);
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      Config.apiRoutes.updateMemberProfile('twclient3', 'testuser'),
      memberProfile,
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getClaim', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET claim', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    const claimId = 123;
    await api.getClaim(clientId, userId, claimId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getClaim(clientId, userId, claimId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getClaimTypes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET claimitems', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getClaimTypes(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getClaimTypes(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getUserFaceAgingResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users faceaging results', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getUserFaceAgingResults(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getUserFaceAgingResults(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getUserFaceAgingResultImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users faceaging results image', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    const age = 16;
    const category = 'thecategory';
    await api.getUserFaceAgingResultImage(clientId, userId, age, category);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${Config.apiRoutes.getUserFaceAgingResultImage(
        clientId,
        userId,
      )}?age=${age}&category=${category}`,
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
        responseType: 'arraybuffer',
      },
    );
  });
});

describe('getUserHealthScore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users healthscore', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getUserHealthScore(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getUserHealthScore(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getUserHealthScoreHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET user healthscorehistory', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'client-id';
    const userId = 'user-id';

    await api.getUserHealthScoreHistory(clientId, userId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getUserHealthScoreHistory(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getUserLifestyleResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users Lifestyleresponses', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getUserLifestyleResponse(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getUserLifestyleResponse(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('submitUserLifestyleResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users Lifestyleresponses', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    const lifestyleData = {};
    await api.submitUserLifestyleResponse(clientId, userId, lifestyleData);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.postUserLifestyleResponse(clientId, userId),
      lifestyleData,
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getUserLifestyleResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users LifestyleResults', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getUserLifestyleResults(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getUserLifestyleResults(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getLifestyleTips', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET users LifestyleTips', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getLifestyleTips(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getLifestyleTips(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getProductRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET recommendations', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    await api.getProductRecommendations(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getProductRecommendations(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });

  it('should call GET recommendations for a certain risk', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'theuserid';
    const tipCategory = 'BMIRisk';
    await api.getProductRecommendationsForTips(clientId, userId, tipCategory);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getProductRecommendationsForTips(
        clientId,
        userId,
        tipCategory,
      ),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getClaimFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET recommendations', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    await api.getClaimFilters(clientId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getClaimFilters(clientId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET claims with filters empty', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'userId';
    await api.getClaims(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getClaims(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getDocuments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET documents', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    await api.getDocuments(clientId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getDocuments(clientId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getMemberBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET member balance', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const clientId = 'theclientid';
    const userId = 'userId';
    await api.getMemberBalance(clientId, userId);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.getBalance(clientId, userId),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('resendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call POST resendEmail', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
    });
    await api.resendEmail('theclientid', 'userId');

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      Config.apiRoutes.resendEmail('theclientid', 'userId'),
      undefined,
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('updateDependentDoB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call PUT updateDependentDoB', async () => {
    axios.put.mockResolvedValueOnce({
      status: 200,
    });

    const clientId = 'clientId';
    const employeeId = 'employeeId';
    const dependentId = 'dependentId';
    const dateOfBirth = 'dateOfBirth';

    await api.updateDependentDoB({
      clientId,
      employeeId,
      dependentId,
      dateOfBirth,
    });

    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      Config.apiRoutes.updateDependentDoB({ clientId, employeeId }),
      {
        clientId,
        dateOfBirth,
        memberId: dependentId,
      },
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getTermsAndConditions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET getTermsAndConditions with locale', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const locale = 'en-US';
    await api.getTermsAndConditions(locale);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchTermsAndConditions(locale),
      {
        headers: {
          'Accept-Language': 'en-US',
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });

  it('should call GET getTermsAndConditions without locale', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    await api.getTermsAndConditions();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchTermsAndConditions(),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});

describe('getMyWellnessNewsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call GET getMyWellnessNewsletter with locale', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    const locale = 'en-US';
    await api.getMyWellnessNewsletter(locale);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchMyWellnessNewsletter(locale),
      {
        headers: {
          'Accept-Language': 'en-US',
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });

  it('should call GET getMyWellnessNewsletter without locale', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
    });
    await api.getMyWellnessNewsletter();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      Config.apiRoutes.fetchMyWellnessNewsletter(),
      {
        headers: {
          Authorization: 'Bearer myaccesstoken',
        },
      },
    );
  });
});
