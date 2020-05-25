import * as actions from '../actions';
import * as types from '../types';
import { configureMockStore } from '@testUtils';
import { PromiseStatus } from '@middlewares';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { flushMicrotasksQueue } from 'react-native-testing-library';

jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  cacheDirectory: 'some-file-dir',
  EncodingType: {
    base64: '',
  },
}));
Date.now = jest.fn(() => 1487076708000);

const initialState = {
  user: {
    clientId: 'testClient',
    userId: 'testUser',
  },
  health: {
    faceAgingConfiguration: {
      reattemptFrequencyInSeconds: 0,
      maxReattempts: 5,
    },
    faceAging: {},
  },
};

const api = {
  getLifestyleTips: jest.fn(() => ({})),
  getUserLifestyleResponse: jest
    .fn()
    .mockResolvedValue({ data: { ethnicity: 'SouthAsian' } }),
  getUserHealthScore: jest.fn(() => ({})),
  getUserLifestyleResults: jest.fn(() => ({})),
  getUserHealthScoreHistory: jest.fn(() => ({
    data: [
      {
        score: 10,
        createdOn: '2019-07-17T10:00:00',
      },
      {
        score: 11,
        createdOn: '2019-06-17T10:00:00',
      },
      {
        score: 12,
        createdOn: '2019-06-15T10:00:01',
      },
      {
        score: 13,
        createdOn: '2019-06-15T10:00:00',
      },
    ],
  })),
  getUserFaceAgingResults: jest.fn(() => ({})),
  uploadFaceAgingPhoto: jest.fn(() => ({
    status: 200,
  })),
  getUserFaceAgingResultImage: jest.fn(() => ({
    data: 'base64data',
  })),
  downloadFaceAgingPhoto: jest.fn(() => ({ data: '' })),
  deleteFaceAgingPhoto: jest.fn(() => ({})),
  getProductRecommendations: jest.fn(() =>
    Promise.resolve({ data: [{ id: '1' }] }),
  ),
  getProductRecommendationsForTips: jest.fn(() =>
    Promise.resolve({ data: [{ id: '1' }] }),
  ),
  submitUserLifestyleResponse: jest.fn(() => ({})),
};

jest.useFakeTimers();

describe('Health actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    Platform.OS = 'ios';
  });

  describe('fetchUserLifestyleResults', () => {
    it('should dispatch start and success action', async () => {
      const store = configureMockStore(api)(initialState);

      await store.dispatch(actions.fetchUserLifestyleResults());
      const dispatched = store.getActions();

      expect(dispatched.map(action => action.type)).toEqual([
        types.FETCH_USER_LIFESTYLE_RESULTS_START,
        types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS,
      ]);
    });

    it('should call api to getUserLifestyleResults', async () => {
      const store = configureMockStore(api)(initialState);

      await store.dispatch(actions.fetchUserLifestyleResults());

      expect(api.getUserLifestyleResults).toHaveBeenCalledTimes(1);
      expect(api.getUserLifestyleResults).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
    });

    it('should return response data and true as hasLifestyleResults when there is data', async () => {
      const lifestyleResults = {
        id: 3,
        bmiScore: 30,
        bmiClass: 'Healthy',
        userId: 'userId',
        clientId: 'clientId',
      };
      const response = {
        data: lifestyleResults,
      };
      api.getUserLifestyleResults.mockReturnValueOnce(response);

      const store = configureMockStore(api)(initialState);
      await store.dispatch(actions.fetchUserLifestyleResults());
      const successAction = store
        .getActions()
        .find(x => x.type === types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS);

      expect(successAction.payload).toEqual({
        hasLifestyleResults: true,
        results: response.data,
      });
    });

    it('should return false as hasLifestyleResults when data is null', async () => {
      const response = {
        data: null,
      };
      api.getUserLifestyleResults.mockReturnValueOnce(response);

      const store = configureMockStore(api)(initialState);
      await store.dispatch(actions.fetchUserLifestyleResults());
      const successAction = store
        .getActions()
        .find(x => x.type === types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS);

      expect(successAction.payload).toEqual({
        hasLifestyleResults: false,
        results: response.data,
      });
    });

    it('should return false as hasLifestyleResults when data is empty', async () => {
      const response = {
        data: {},
      };
      api.getUserLifestyleResults.mockReturnValueOnce(response);

      const store = configureMockStore(api)(initialState);
      await store.dispatch(actions.fetchUserLifestyleResults());
      const successAction = store
        .getActions()
        .find(x => x.type === types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS);

      expect(successAction.payload).toEqual({
        hasLifestyleResults: false,
        results: response.data,
      });
    });
  });

  describe('submitLifestyleResponse', () => {
    it('should create actions to submit user lifestyle response', async () => {
      const store = configureMockStore(api)(initialState);
      const expectedActions = [
        { type: types.SUBMIT_USER_LIFESTYLE_RESPONSE_START },
        { type: types.SUBMIT_USER_LIFESTYLE_RESPONSE_SUCCESS, payload: {} },
        { type: types.FETCH_USER_LIFESTYLE_RESULTS_START },
        {
          type: types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS,
          payload: { hasLifestyleResults: false, results: undefined },
        },
        { type: types.FETCH_LIFESTYLE_TIPS_START },
        { type: types.FETCH_LIFESTYLE_TIPS_SUCCESS },
      ];
      const lifestyleResponse = {
        ethnicity: 'Other',
        exercise: 'High',
        image: 'image',
      };
      store
        .dispatch(actions.submitUserLifestyleResponse(lifestyleResponse))
        .then(() => {
          expect(api.submitUserLifestyleResponse).toHaveBeenCalledTimes(1);
          expect(api.submitUserLifestyleResponse).toHaveBeenCalledWith(
            initialState.user.clientId,
            initialState.user.userId,
            {
              ethnicity: 'Other',
              exercise: 'High',
            },
          );
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions),
          );
        });
    });
  });

  it('should create actions to get user health score', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_USER_HEALTH_SCORE_START },
      {
        type: types.FETCH_USER_HEALTH_SCORE_SUCCESS,
        payload: {
          score: undefined,
          status: PromiseStatus.ERROR,
        },
      },
    ];
    return store.dispatch(actions.getUserHealthScore()).then(() => {
      expect(api.getUserHealthScore).toHaveBeenCalledTimes(1);
      expect(api.getUserHealthScore).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create actions to get user health score but receive error', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_USER_HEALTH_SCORE_START },
      {
        type: types.FETCH_USER_HEALTH_SCORE_SUCCESS,
        payload: {
          score: 88,
          status: 'SUCCESS',
        },
      },
    ];
    api.getUserHealthScore = jest.fn().mockResolvedValue({
      status: 200,
      data: { score: 88 },
    });
    return store.dispatch(actions.getUserHealthScore()).then(() => {
      expect(api.getUserHealthScore).toHaveBeenCalledTimes(1);
      expect(api.getUserHealthScore).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('fetchUserHealthScoreHistory', () => {
    it('should create actions to get sorted user health score history', () => {
      const store = configureMockStore(api)(initialState);
      const expectedActions = [
        { type: types.FETCH_USER_HEALTH_SCORE_HISTORY_START },
        {
          type: types.FETCH_USER_HEALTH_SCORE_HISTORY_SUCCESS,
          payload: {
            status: PromiseStatus.SUCCESS,
            data: [
              {
                score: 13,
                createdOn: '2019-06-15T10:00:00',
              },
              {
                score: 12,
                createdOn: '2019-06-15T10:00:01',
              },
              {
                score: 11,
                createdOn: '2019-06-17T10:00:00',
              },
              {
                score: 10,
                createdOn: '2019-07-17T10:00:00',
              },
            ],
          },
        },
      ];
      return store.dispatch(actions.getUserHealthScoreHistory()).then(() => {
        expect(api.getUserHealthScoreHistory).toHaveBeenCalledTimes(1);
        expect(api.getUserHealthScoreHistory).toHaveBeenCalledWith(
          initialState.user.clientId,
          initialState.user.userId,
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should create actions with error response when api return empty data', () => {
      const apiReturnError = {
        getUserHealthScoreHistory: jest.fn(() => ({
          data: [],
        })),
      };
      const store = configureMockStore(apiReturnError)(initialState);
      const expectedActions = [
        { type: types.FETCH_USER_HEALTH_SCORE_HISTORY_START },
        {
          type: types.FETCH_USER_HEALTH_SCORE_HISTORY_SUCCESS,
          payload: {
            status: PromiseStatus.ERROR,
          },
        },
      ];
      return store.dispatch(actions.getUserHealthScoreHistory()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  it('should create actions to get user lifestyle data', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_USER_LIFESTYLE_RESPONSE_START },

      {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS,
        payload: {
          ethnicity: 'SouthAsian',
          isAsian: true,
        },
      },
    ];
    store.dispatch(actions.fetchUserLifestyleResponse()).then(() => {
      expect(api.getUserLifestyleResponse).toHaveBeenCalledTimes(1);
      expect(api.getUserLifestyleResponse).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('Upload Face aging photo', () => {
    it('should create actions for uploading the face aging photo and fetch faceaging result', async () => {
      const store = configureMockStore(api)(initialState);

      const expectedActions = [
        { type: types.UPLOAD_FACE_IMAGE_START },
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.UPLOAD_FACE_IMAGE_SUCCESS },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: true,
          },
        },
      ];

      const image = { uri: 'someUri' };
      await store.dispatch(actions.uploadFaceAgingPhoto(image));
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
        { uri: 'someUri', type: 'image/jpeg', fileName: 'image.jpg' },
      );
      await flushMicrotasksQueue();
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create actions for uploading the face aging photo and fetch faceaging result for iOS base64', async () => {
      const store = configureMockStore(api)(initialState);

      const expectedActions = [
        { type: types.UPLOAD_FACE_IMAGE_START },
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.UPLOAD_FACE_IMAGE_SUCCESS },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: true,
          },
        },
      ];

      const imgPath = 'someUri base 64';

      const image = { uri: imgPath };

      await store.dispatch(actions.uploadFaceAgingPhoto(image));
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
        { uri: imgPath, type: 'image/jpeg', fileName: 'image.jpg' },
      );
      await flushMicrotasksQueue();
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create actions uploading the face aging photo and fetch faceaging result on android on first upload', async () => {
      Platform.OS = 'android';
      const store = configureMockStore(api)(initialState);

      FileSystem.getInfoAsync.mockResolvedValueOnce({
        exists: false,
      });

      FileSystem.cacheDirectory = 'some-file-dir';

      const expectedActions = [
        { type: types.UPLOAD_FACE_IMAGE_START },
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.UPLOAD_FACE_IMAGE_SUCCESS },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: true,
          },
        },
      ];

      const image = { uri: 'someUri base64' };

      await store.dispatch(actions.uploadFaceAgingPhoto(image));
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
        {
          uri: `${FileSystem.cacheDirectory}uploadTmp1487076708000.jpg`,
          type: 'image/jpeg',
          fileName: 'image.jpg',
        },
      );
      await flushMicrotasksQueue();
      expect(store.getActions()).toEqual(expectedActions);
      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledTimes(1);
    });

    it('should not create a temp cache directory if already created', async () => {
      Platform.OS = 'android';
      const store = configureMockStore(api)(initialState);

      FileSystem.getInfoAsync.mockResolvedValueOnce({
        exists: true,
      });

      FileSystem.cacheDirectory = 'some-file-dir';

      const expectedActions = [
        { type: types.UPLOAD_FACE_IMAGE_START },
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.UPLOAD_FACE_IMAGE_SUCCESS },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: true,
          },
        },
      ];

      const image = { uri: 'someUri base64' };

      await store.dispatch(actions.uploadFaceAgingPhoto(image));
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.uploadFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
        {
          uri: `${FileSystem.cacheDirectory}uploadTmp1487076708000.jpg`,
          type: 'image/jpeg',
          fileName: 'image.jpg',
        },
      );
      await flushMicrotasksQueue();
      expect(store.getActions()).toEqual(expectedActions);
      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });
  });

  describe('fetchUserFaceAgingResult', () => {
    it('should create actions for get User Faceaging results with no results', async () => {
      const store = configureMockStore(api)(initialState);

      const expectedActions = [
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: true,
          },
        },
      ];

      return store.dispatch(actions.getUserFaceAgingResults()).then(() => {
        expect(api.getUserFaceAgingResults).toHaveBeenCalledTimes(1);
        expect(api.getUserFaceAgingResults).toHaveBeenCalledWith(
          initialState.user.clientId,
          initialState.user.userId,
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should create actions for get User Faceaging with images', async () => {
      const store = configureMockStore(api)(initialState);

      const expectedActions = [
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_START },
        {
          type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS,
          payload: {
            age: undefined,
            base64Image: 'data:image/jpeg;base64,YmFzZTY0ZGF0YQ==',
            category: undefined,
          },
        },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 1,
            faceAgingIsDone: true,
          },
        },
      ];

      api.getUserFaceAgingResults = jest.fn().mockResolvedValue({
        data: {
          faceAgingIsDone: true,
          results: [{}],
        },
      });
      return store.dispatch(actions.getUserFaceAgingResults()).then(() => {
        expect(api.getUserFaceAgingResults).toHaveBeenCalledTimes(1);
        expect(api.getUserFaceAgingResults).toHaveBeenCalledWith(
          initialState.user.clientId,
          initialState.user.userId,
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it.skip('should create actions for get User Faceaging results with polling', async () => {
      const customApi = {
        ...api,
        getUserFaceAgingResults: jest.fn(() => ({
          status: 200,
          data: {
            faceAgingIsDone: false,
            results: [],
          },
        })),
      };

      const store = configureMockStore(customApi)({
        ...initialState,
        health: {
          ...initialState.health,
          faceAgingConfiguration: {
            reattemptFrequencyInSeconds: 1,
            maxReattempts: 5,
          },
        },
      });

      const expectedActions = [
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 0,
            faceAgingIsDone: false,
          },
        },
      ];

      store.dispatch(actions.getUserFaceAgingResults());
      await flushMicrotasksQueue();
      await flushMicrotasksQueue();
      expect(customApi.getUserFaceAgingResults).toHaveBeenCalledTimes(1);
      expect(customApi.getUserFaceAgingResults).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );

      expect(store.getActions()).toEqual(expectedActions);
    });

    it.skip('should create actions for get User Faceaging results and get images if successful', async () => {
      const customApi = {
        ...api,
        getUserFaceAgingResults: jest.fn(() => ({
          status: 200,
          data: {
            faceAgingIsDone: true,
            results: [
              {
                age: 35,
                category: 'healthy',
              },
              {
                age: 35,
                category: 'unhealthy',
              },
            ],
          },
        })),
      };

      const store = configureMockStore(customApi)(initialState);

      const expectedActions = [
        { type: types.FETCH_USER_FACEAGING_RESULTS_START },
        { type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_START },
        { type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_START },
        {
          type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
          payload: {
            expectedTotalResults: 2,
            faceAgingIsDone: true,
          },
        },
        {
          type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS,
          payload: {
            age: 35,
            base64Image: 'data:image/jpeg;base64,YmFzZTY0ZGF0YQ==',
            category: 'healthy',
          },
        },
        {
          type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS,
          payload: {
            age: 35,
            base64Image: 'data:image/jpeg;base64,YmFzZTY0ZGF0YQ==',
            category: 'unhealthy',
          },
        },
      ];

      store.dispatch(actions.getUserFaceAgingResults());
      await flushMicrotasksQueue();
      expect(customApi.getUserFaceAgingResults).toHaveBeenCalledTimes(1);
      expect(customApi.getUserFaceAgingResults).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(customApi.getUserFaceAgingResultImage).toHaveBeenCalledTimes(2);
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should create actions for get User Faceaging result Image', async () => {
      const store = configureMockStore(api)(initialState);
      const imageRequest = {
        age: 35,
        category: 'healthy',
      };

      const expectedActions = [
        { type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_START },
        {
          type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS,
          payload: {
            age: imageRequest.age,
            base64Image: 'data:image/jpeg;base64,YmFzZTY0ZGF0YQ==',
            category: imageRequest.category,
          },
        },
      ];

      return store
        .dispatch(actions.getUserFaceAgingResultImage(imageRequest))
        .then(() => {
          expect(api.getUserFaceAgingResultImage).toHaveBeenCalledTimes(1);
          expect(api.getUserFaceAgingResultImage).toHaveBeenCalledWith(
            initialState.user.clientId,
            initialState.user.userId,
            imageRequest.age,
            imageRequest.category,
          );
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  it('should create actions to reset the loader', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [{ type: types.RESET_LOADER }];
    store.dispatch(actions.resetLoader());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create actions for downloading the face aging photo', async () => {
    const store = configureMockStore(api)(initialState);

    const expectedActions = [
      { type: types.DOWNLOAD_FACE_IMAGE_START },
      {
        type: types.DOWNLOAD_FACE_IMAGE_SUCCESS,
        payload: { uri: 'data:image/jpeg;base64,' },
      },
    ];

    return store.dispatch(actions.downloadFaceAgingPhoto()).then(() => {
      expect(api.downloadFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.downloadFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create actions for deleting the face aging photo', async () => {
    const store = configureMockStore(api)(initialState);

    const expectedActions = [
      { type: types.DELETE_FACE_IMAGE_START },
      { type: types.DELETE_FACE_IMAGE_SUCCESS },
    ];

    return store.dispatch(actions.deleteFaceAgingPhoto()).then(() => {
      expect(api.deleteFaceAgingPhoto).toHaveBeenCalledTimes(1);
      expect(api.deleteFaceAgingPhoto).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create actions to get lifestyle tips', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_LIFESTYLE_TIPS_START },
      { type: types.FETCH_LIFESTYLE_TIPS_SUCCESS },
    ];
    return store.dispatch(actions.fetchLifestyleTips()).then(() => {
      expect(api.getLifestyleTips).toHaveBeenCalledTimes(1);
      expect(api.getLifestyleTips).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should create actions to get product recommendations', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_PRODUCT_RECOMMENDATIONS_START },
      {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_SUCCESS,
        payload: [{ id: '1' }],
      },
    ];
    await store.dispatch(actions.fetchProductRecommendations());

    expect(api.getProductRecommendations).toHaveBeenCalledTimes(1);
    expect(api.getProductRecommendations).toHaveBeenCalledWith(
      initialState.user.clientId,
      initialState.user.userId,
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should create actions to get product recommendations for tips', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_START },
      {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_SUCCESS,
        payload: [{ id: '1' }],
      },
    ];
    const tipCategory = 'bmi';
    await store.dispatch(
      actions.fetchProductRecommendationsForTips({ tipCategory }),
    );

    expect(api.getProductRecommendationsForTips).toHaveBeenCalledTimes(1);
    expect(api.getProductRecommendationsForTips).toHaveBeenCalledWith(
      initialState.user.clientId,
      initialState.user.userId,
      'BMIRisk',
    );
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should increment up submit count by 1', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [{ type: types.SET_SUBMIT_LIFESTYLE_FORM_COUNT }];
    await store.dispatch(actions.setSubmitLifestyleFormCount());

    expect(store.getActions()).toEqual(expectedActions);
  });
});
