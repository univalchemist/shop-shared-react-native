import reducer from '../reducer';
import * as types from '../types';
import { PromiseStatus } from '@middlewares';

const initialState = {
  ethnicityOptions: {
    EastAsian: 'ethnicityOptions.EastAsian',
    SouthAsian: 'ethnicityOptions.SouthAsian',
    Caucasian: 'ethnicityOptions.Caucasian',
    Other: 'ethnicityOptions.Other',
  },
  data: {},
  lifestyleTips: {
    tips: {},
    status: PromiseStatus.START,
  },
  healthScore: {
    status: PromiseStatus.START,
    score: undefined,
  },
  healthScoreHistory: {
    status: PromiseStatus.START,
    data: undefined,
  },
  results: {
    bmi: undefined,
    bmiClass: '',
    bmiPoint: undefined,
    totalPoint: 0,
    totalRisk: 'Low',
    smokeRisk: 'Low',
    alcoholRisk: 'Low',
    exerciseRisk: 'Low',
    sleepRisk: 'Low',
    mentalHealthRisk: 'Low',
    nutritionRisk: 'Low',
  },
  lifestyleResults: {
    bmiScore: 0,
    bmiClass: '',
  },
  faceAgingConfiguration: {
    reattemptFrequencyInSeconds: 5,
    maxReattempts: 12,
  },
  faceAging: {
    faceAgingIsDone: true,
    isError: false,
    expectedTotalResults: 0,
    currentTotalResults: 0,
    results: {},
    image: null,
  },
  fetchHealthResponseCompleted: false,
  fetchHealthResultsCompleted: false,
  hasLifestyleResults: false,
  fetchUserLifestyleResponseCompleted: false,
  fetchUserLifestyleResultsCompleted: false,
  fetchFaceAgingImageCompleted: false,
  fetchUserLifestyleResultsStatus: PromiseStatus.START,
  submittingUserLifestyleResponse: false,
  submittingUserHealthResponse: false,
  fetchingFaceAgingImage: false,
  productRecommendations: [],
  productRecommendationsForTips: [],
  lifestyleFormSubmitCount: 0,
};

describe('Health reducer', () => {
  it('should return the initialState', () => {
    const state = reducer(undefined, {});

    expect(state).toEqual(initialState);
  });

  it('should update the lifestyleform submit count', () => {
    const action = {
      type: types.SET_SUBMIT_LIFESTYLE_FORM_COUNT,
    };

    const response = reducer(undefined, action);

    expect(response.lifestyleFormSubmitCount).toEqual(1);
  });

  it('should have start as initial health score status', () => {
    const initialHealthScoreState = reducer(undefined, {}).healthScore;

    expect(initialHealthScoreState.status).toBe(PromiseStatus.START);
  });

  it('should have undefined as initial health score', () => {
    const initialHealthScoreState = reducer(undefined, {}).healthScore;

    expect(initialHealthScoreState.score).toBe(undefined);
  });

  it('should return start status as initial health score history status', () => {
    const initialHealthScoreHistoryState = reducer(undefined, {})
      .healthScoreHistory;

    expect(initialHealthScoreHistoryState.status).toBe(PromiseStatus.START);
  });

  it('should return appropriate initial state as initial health score history', () => {
    const initialHealthScoreHistoryState = reducer(undefined, {})
      .healthScoreHistory;

    expect(initialHealthScoreHistoryState.data).toEqual(undefined);
  });

  describe('LIFESTYLE_RESPONSE', () => {
    it('should handle FETCH_USER_LIFESTYLE_RESPONSE_START', () => {
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_START,
        payload: {},
      };

      const response = reducer(undefined, action);

      expect(response.fetchUserLifestyleResponseCompleted).toEqual(false);
    });

    it('should handle FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS', () => {
      const expectedState = {
        data: {
          height: '182',
          weight: '82',
          waistCircumference: '',
          hasSmoked: false,
          hasConsumedAlcohol: false,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'Zero',
          frequencyOfDepression: 'Zero',
          frequencyOfSugaryDrink: 'Low',
        },
      };
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS,
        payload: {
          height: '182',
          weight: '82',
          waistCircumference: '',
          hasSmoked: false,
          hasConsumedAlcohol: false,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'Zero',
          frequencyOfDepression: 'Zero',
          frequencyOfSugaryDrink: 'Low',
        },
      };

      const initialState = {
        data: {
          height: '',
          weight: '',
          waistCircumference: '',
          hasSmoked: false,
          hasConsumedAlcohol: true,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'High',
          frequencyOfDepression: 'High',
          frequencyOfSugaryDrink: 'Low',
        },
      };

      const response = reducer(initialState, action);

      expect(response.data).toEqual(expectedState.data);
      expect(response.fetchUserLifestyleResponseCompleted).toEqual(true);
    });

    it('should handle FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS when waist circumference is null', () => {
      const expectedState = {
        data: {
          height: '182',
          weight: '82',
          hasSmoked: false,
          hasConsumedAlcohol: false,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'Zero',
          frequencyOfDepression: 'Zero',
          frequencyOfSugaryDrink: 'Low',
        },
      };
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS,
        payload: {
          height: '182',
          weight: '82',
          waistCircumference: null,
          hasSmoked: false,
          hasConsumedAlcohol: false,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'Zero',
          frequencyOfDepression: 'Zero',
          frequencyOfSugaryDrink: 'Low',
        },
      };

      const initialState = {
        data: {
          height: '',
          weight: '',
          waistCircumference: 100,
          hasSmoked: false,
          hasConsumedAlcohol: true,
          hasDiabetesInFamily: false,
          hasHighBloodPressure: false,
          takesMedication: false,
          hasFatigue: false,
          frequencyOfInterest: 'High',
          frequencyOfDepression: 'High',
          frequencyOfSugaryDrink: 'Low',
        },
      };

      const response = reducer(initialState, action);

      expect(response.data).toEqual(expectedState.data);
      expect(response.fetchUserLifestyleResponseCompleted).toEqual(true);
    });

    it('should handle FETCH_USER_LIFESTYLE_RESPONSE_ERROR', () => {
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_ERROR,
        payload: {},
      };

      const response = reducer(undefined, action);

      expect(response.fetchUserLifestyleResponseCompleted).toEqual(true);
    });
  });

  describe('LIFESTYLE_RESULTS', () => {
    it('should handle FETCH_USER_LIFESTYLE_RESULTS_START', () => {
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESULTS_START,
        payload: {},
      };

      const response = reducer(undefined, action);

      expect(response.fetchUserLifestyleResultsCompleted).toEqual(false);
      expect(response.fetchUserLifestyleResultsStatus).toEqual(
        PromiseStatus.START,
      );
    });

    it('should handle FETCH_USER_LIFESTYLE_RESULTS_SUCCESS', () => {
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS,
        payload: {
          hasLifestyleResults: true,
          results: {
            bmiScore: 30,
            bmiClass: 'Healthy',
          },
        },
      };

      const initialState = {
        lifestyleResults: {
          bmiScore: null,
          bmiClass: '',
        },
        hasLifestyleResults: false,
      };

      const response = reducer(initialState, action);

      expect(response.lifestyleResults).toEqual(action.payload.results);
      expect(response.hasLifestyleResults).toEqual(
        action.payload.hasLifestyleResults,
      );
      expect(response.fetchUserLifestyleResultsCompleted).toEqual(true);
      expect(response.fetchUserLifestyleResultsStatus).toEqual(
        PromiseStatus.SUCCESS,
      );
    });

    it('should handle FETCH_USER_LIFESTYLE_RESULTS_ERROR', () => {
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESULTS_ERROR,
        payload: {},
      };

      const response = reducer(undefined, action);

      expect(response.fetchUserLifestyleResultsCompleted).toEqual(true);
      expect(response.fetchUserLifestyleResultsStatus).toEqual(
        PromiseStatus.ERROR,
      );
    });
  });

  it('should handle FETCH_USER_HEALTH_SCORE_START', () => {
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_START,
      payload: {},
    };

    const response = reducer(
      {
        healthScore: {
          status: PromiseStatus.SUCCESS,
          score: 22,
        },
      },
      action,
    );

    expect(response.healthScore.status).toEqual(PromiseStatus.START);
    expect(response.healthScore.score).toEqual(undefined);
  });

  it('should handle FETCH_USER_HEALTH_SCORE_SUCCESS', () => {
    const payload = {
      status: PromiseStatus.SUCCESS,
      score: 34,
    };
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_SUCCESS,
      payload,
    };

    const response = reducer(
      {
        healthScore: {
          status: PromiseStatus.ERROR,
          score: undefined,
        },
      },
      action,
    );

    expect(response.healthScore.status).toEqual(PromiseStatus.SUCCESS);
    expect(response.healthScore.score).toEqual(payload.score);
  });

  it('should handle FETCH_USER_HEALTH_SCORE_ERROR', () => {
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_ERROR,
      payload: {},
    };

    const response = reducer(
      {
        healthScore: {
          status: PromiseStatus.SUCCESS,
          score: 90,
        },
      },
      action,
    );

    expect(response.healthScore.status).toEqual(PromiseStatus.ERROR);
    expect(response.healthScore.score).toEqual(undefined);
  });

  it('should handle FETCH_USER_HEALTH_SCORE_HISTORY_START', () => {
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_HISTORY_START,
      payload: {},
    };

    const response = reducer(
      {
        healthScoreHistory: {
          status: PromiseStatus.SUCCESS,
          data: [{}],
        },
      },
      action,
    );

    expect(response.healthScoreHistory.status).toEqual(PromiseStatus.START);
    expect(response.healthScoreHistory.data).toEqual(undefined);
  });

  it('should handle FETCH_USER_HEALTH_SCORE_HISTORY_SUCCESS', () => {
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_HISTORY_SUCCESS,
      payload: {
        status: PromiseStatus.SUCCESS,
        data: [
          { score: 10, date: 'some-date' },
          { score: 20, date: 'some-date' },
        ],
      },
    };

    const response = reducer(
      {
        healthScoreHistory: {
          status: PromiseStatus.START,
          data: [],
        },
      },
      action,
    );

    expect(response.healthScoreHistory.status).toEqual(PromiseStatus.SUCCESS);
    expect(response.healthScoreHistory.data).toEqual(action.payload.data);
  });

  it('should handle FETCH_USER_HEALTH_SCORE_HISTORY_ERROR', () => {
    const action = {
      type: types.FETCH_USER_HEALTH_SCORE_HISTORY_ERROR,
      payload: {},
    };

    const response = reducer(
      {
        healthScoreHistory: {
          status: PromiseStatus.SUCCESS,
          data: [{ score: 10, date: 'some-date' }],
        },
      },
      action,
    );

    expect(response.healthScoreHistory.status).toEqual(PromiseStatus.ERROR);
    expect(response.healthScoreHistory.data).toEqual(undefined);
  });

  it('should handle SUBMIT_USER_LIFESTYLE_RESPONSE_START', () => {
    const action = {
      type: types.SUBMIT_USER_LIFESTYLE_RESPONSE_START,
      payload: {},
    };

    const response = reducer(undefined, action);

    expect(response.submittingUserLifestyleResponse).toEqual(true);
  });

  it('should handle SUBMIT_USER_LIFESTYLE_RESPONSE_ERROR', () => {
    const action = {
      type: types.SUBMIT_USER_LIFESTYLE_RESPONSE_ERROR,
      payload: {},
    };

    const response = reducer(undefined, action);

    expect(response.submittingUserLifestyleResponse).toEqual(false);
  });

  it('should handle SUBMIT_USER_LIFESTYLE_RESPONSE_SUCCESS', () => {
    const expectedState = initialState;

    const action = {
      type: types.SUBMIT_USER_LIFESTYLE_RESPONSE_SUCCESS,
      payload: {},
    };

    const state = reducer(undefined, action);
    expect(state).toEqual(expectedState);
  });

  describe('RESET_LOADER', () => {
    let response;
    beforeEach(() => {
      const action = {
        type: types.RESET_LOADER,
      };

      response = reducer(
        {
          fetchFaceAgingImageCompleted: true,
          fetchUserLifestyleResponseCompleted: true,
        },
        action,
      );
    });
    it('should set fetchUserLifestyleResponseCompleted  to false', () => {
      expect(response.fetchUserLifestyleResponseCompleted).toEqual(false);
    });

    it('should set fetchFaceAgingImageCompleted to false', () => {
      expect(response.fetchFaceAgingImageCompleted).toEqual(false);
    });
  });

  describe('face aging', () => {
    it('should handle DOWNLOAD_FACE_IMAGE_START', () => {
      const action = {
        type: types.DOWNLOAD_FACE_IMAGE_START,
      };

      const response = reducer(undefined, action);

      expect(response.faceAging.faceAgingIsDone).toEqual(true);
      expect(response.faceAging.expectedTotalResults).toEqual(0);
      expect(response.faceAging.currentTotalResults).toEqual(0);
      expect(response.faceAging.results).toEqual({});
    });

    it('should handle DOWNLOAD_FACE_IMAGE_SUCCESS', () => {
      const action = {
        type: types.DOWNLOAD_FACE_IMAGE_SUCCESS,
      };

      const response = reducer(undefined, action);

      expect(response.fetchFaceAgingImageCompleted).toEqual(true);
      expect(response.fetchingFaceAgingImage).toEqual(false);
    });

    it('should handle FETCH_USER_FACEAGING_RESULTS_SUCCESS', () => {
      const action = {
        type: types.FETCH_USER_FACEAGING_RESULTS_SUCCESS,
        payload: {
          faceAgingIsDone: true,
          expectedTotalResults: 3,
        },
      };

      const response = reducer(undefined, action);

      expect(response.faceAging.faceAgingIsDone).toEqual(true);
      expect(response.faceAging.isError).toEqual(false);
      expect(response.faceAging.expectedTotalResults).toEqual(3);
      expect(response.faceAging.currentTotalResults).toEqual(0);
      expect(response.faceAging.results).toEqual({});
    });

    it('should handle FETCH_USER_FACEAGING_RESULTS_ERROR', () => {
      const action = {
        type: types.FETCH_USER_FACEAGING_RESULTS_ERROR,
        payload: {
          faceAgingIsDone: false,
          expectedTotalResults: 0,
        },
      };

      const response = reducer(undefined, action);

      expect(response.faceAging.faceAgingIsDone).toEqual(false);
      expect(response.faceAging.isError).toEqual(true);
      expect(response.faceAging.expectedTotalResults).toEqual(0);
      expect(response.faceAging.currentTotalResults).toEqual(0);
      expect(response.faceAging.results).toEqual({});
    });

    it('should handle FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS', () => {
      const action = {
        type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS,
        payload: {
          age: 35,
          category: 'healthy',
          base64Image: 'base64Image',
        },
      };

      const response = reducer(undefined, action);

      expect(response.faceAging.results).toEqual({
        35: {
          healthy: 'base64Image',
        },
      });
      expect(response.faceAging.currentTotalResults).toEqual(1);
      expect(response.faceAging.isError).toEqual(false);
    });

    it('should handle FETCH_USER_FACEAGING_RESULT_IMAGE_ERROR', () => {
      const action = {
        type: types.FETCH_USER_FACEAGING_RESULT_IMAGE_ERROR,
        payload: {},
      };

      const response = reducer(undefined, action);
      expect(response.faceAging.currentTotalResults).toEqual(1);
      expect(response.faceAging.isError).toEqual(true);
    });

    it('should handle UPLOAD_FACE_IMAGE_SUCCESS', () => {
      const action = {
        type: types.UPLOAD_FACE_IMAGE_SUCCESS,
      };

      const response = reducer(undefined, action);

      expect(response.faceAging.faceAgingIsDone).toEqual(false);
      expect(response.faceAging.isError).toEqual(false);
      expect(response.faceAging.expectedTotalResults).toEqual(0);
      expect(response.faceAging.currentTotalResults).toEqual(0);
    });

    it('should handle UPLOAD_FACE_IMAGE_ERROR', () => {
      const action = {
        type: types.UPLOAD_FACE_IMAGE_ERROR,
      };

      const initialState = {
        faceAging: {
          faceAgingIsDone: false,
          isError: false,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
        },
        faceAgingConfiguration: {},
      };

      const expectedState = {
        faceAging: {
          faceAgingIsDone: false,
          isError: false,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
        },
        faceAgingConfiguration: {},
      };

      const response = reducer(initialState, action);

      expect(response).toEqual(expectedState);
    });
  });

  describe('FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS', () => {
    it('should save only answers with value to state', () => {
      const expectedState = {
        data: {
          uninterestFrequency: 'Sometimes',
        },
      };
      const action = {
        type: types.FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS,
        payload: {
          uninterestFrequency: 'Sometimes',
          depressionFrequency: null,
          sleepDuration: undefined,
        },
      };

      const initialState = {
        data: {},
      };

      const response = reducer(initialState, action);

      expect(response.data).toEqual(expectedState.data);
    });
  });

  describe('LIFESTYLE_TIPS', () => {
    it('should handle FETCH_LIFESTYLE_TIPS_START', () => {
      const action = {
        type: types.FETCH_LIFESTYLE_TIPS_START,
        payload: {
          bmi: [
            {
              text: 'text',
              topic: 'topic 1',
              source: 'source 1',
            },
          ],
        },
      };

      const initialState = {
        lifestyleTips: {
          status: PromiseStatus.SUCCESS,
          tips: {},
        },
      };

      const response = reducer(initialState, action);

      const expectedState = {
        lifestyleTips: {
          tips: {},
          status: PromiseStatus.START,
        },
      };

      expect(response.lifestyleTips).toEqual(expectedState.lifestyleTips);
    });

    it('should handle FETCH_LIFESTYLE_TIPS_SUCCESS', () => {
      const action = {
        type: types.FETCH_LIFESTYLE_TIPS_SUCCESS,
        payload: {
          bmi: [
            {
              text: 'text',
              topic: 'topic 1',
              source: 'source 1',
            },
          ],
        },
      };

      const initialState = {
        lifestyleTips: {
          status: PromiseStatus.START,
          tips: {},
        },
      };

      const response = reducer(initialState, action);

      const expectedState = {
        lifestyleTips: {
          tips: {
            bmi: [
              {
                text: 'text',
                topic: 'topic 1',
                source: 'source 1',
              },
            ],
          },
          status: PromiseStatus.SUCCESS,
        },
      };

      expect(response.lifestyleTips).toEqual(expectedState.lifestyleTips);
    });

    it('should handle FETCH_LIFESTYLE_TIPS_ERROR', () => {
      const action = {
        type: types.FETCH_LIFESTYLE_TIPS_ERROR,
        payload: {},
      };

      const initialState = {
        lifestyleTips: {
          tips: {
            bmi: [
              {
                text: 'text',
                topic: 'topic 1',
                source: 'source 1',
              },
            ],
          },
          status: PromiseStatus.SUCCESS,
        },
      };

      const response = reducer(initialState, action);

      const expectedState = {
        lifestyleTips: {
          tips: {},
          status: PromiseStatus.ERROR,
        },
      };

      expect(response.lifestyleTips).toEqual(expectedState.lifestyleTips);
    });
  });

  describe('FETCH_PRODUCT_RECOMMENDATIONS', () => {
    it('should handle FETCH_PRODUCT_RECOMMENDATIONS_SUCCESS', () => {
      const action = {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_SUCCESS,
        payload: [{ id: '1' }],
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        productRecommendations: [{ id: '1' }],
      };

      expect(state).toEqual(expectedState);
    });
  });

  describe('FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS', () => {
    it('should handle FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_START', () => {
      const action = {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_START,
        payload: [{ id: '1' }],
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        productRecommendationsForTips: [],
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_ERROR', () => {
      const action = {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_ERROR,
        payload: [{ id: '1' }],
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        productRecommendationsForTips: [],
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_SUCCESS', () => {
      const action = {
        type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_SUCCESS,
        payload: [{ id: '1' }],
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        productRecommendationsForTips: [{ id: '1' }],
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESPONSE_START', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESPONSE_START,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchHealthResponseCompleted: false,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_FACEAGING_RESULTS_START', () => {
      const action = {
        type: types.FETCH_USER_FACEAGING_RESULTS_START,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        faceAging: {
          ...state.faceAging,
          faceAgingIsDone: false,
          isError: false,
          currentTotalResults: 0,
          results: {},
        },
        faceAgingConfiguration: {
          ...state.faceAgingConfiguration,
        },
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESPONSE_SUCCESS', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESPONSE_SUCCESS,
        payload: {},
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchHealthResponseCompleted: true,
        data: {},
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESPONSE_ERROR', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESPONSE_ERROR,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchHealthResponseCompleted: true,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle SUBMIT_USER_HEALTH_RESPONSE_SUCCESS', () => {
      const action = {
        type: types.SUBMIT_USER_HEALTH_RESPONSE_SUCCESS,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle SUBMIT_USER_HEALTH_RESPONSE_ERROR', () => {
      const action = {
        type: types.SUBMIT_USER_HEALTH_RESPONSE_ERROR,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        submittingUserHealthResponse: false,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle SUBMIT_USER_HEALTH_RESPONSE_START', () => {
      const action = {
        type: types.SUBMIT_USER_HEALTH_RESPONSE_START,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        submittingUserHealthResponse: true,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle DOWNLOAD_FACE_IMAGE_ERROR', () => {
      const action = {
        type: types.DOWNLOAD_FACE_IMAGE_ERROR,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchFaceAgingImageCompleted: true,
        fetchingFaceAgingImage: false,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle DELETE_FACE_IMAGE_SUCCESS', () => {
      const action = {
        type: types.DELETE_FACE_IMAGE_SUCCESS,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        faceAging: {
          faceAgingIsDone: true,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
          image: null,
        },
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESULTS_SUCCESS', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESULTS_SUCCESS,
        payload: {
          results: {},
          hasHealthResults: false,
        },
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        results: initialState.results,
        hasHealthResults: false,
        fetchHealthResultsCompleted: true,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESULTS_ERROR', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESULTS_ERROR,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchHealthResultsCompleted: true,
      };

      expect(state).toEqual(expectedState);
    });

    it('should handle FETCH_USER_HEALTH_RESULTS_START', () => {
      const action = {
        type: types.FETCH_USER_HEALTH_RESULTS_START,
      };

      const state = reducer(undefined, action);

      const expectedState = {
        ...initialState,
        fetchHealthResultsCompleted: false,
      };

      expect(state).toEqual(expectedState);
    });
  });
});
