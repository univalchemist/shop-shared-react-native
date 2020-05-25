import * as types from './types';
import { PromiseStatus } from '@middlewares';

const initialState = {
  ethnicityOptions: {
    EastAsian: 'ethnicityOptions.EastAsian',
    SouthAsian: 'ethnicityOptions.SouthAsian',
    Caucasian: 'ethnicityOptions.Caucasian',
    Other: 'ethnicityOptions.Other',
  },
  data: {},
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
  submittingUserHealthResponse: false,
  submittingUserLifestyleResponse: false,
  fetchingFaceAgingImage: false,
  productRecommendations: [],
  productRecommendationsForTips: [],
  lifestyleFormSubmitCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_FACE_IMAGE_SUCCESS: {
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
          faceAgingIsDone: false,
          isError: false,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
        },
        faceAgingConfiguration: {
          ...state.faceAgingConfiguration,
        },
      };
    }
    case types.UPLOAD_FACE_IMAGE_ERROR: {
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
        },
      };
    }
    case types.FETCH_USER_FACEAGING_RESULTS_START: {
      return {
        ...state,
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
    }
    case types.FETCH_USER_FACEAGING_RESULTS_SUCCESS: {
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
          faceAgingIsDone: action.payload.faceAgingIsDone,
          isError: action.payload.isError ?? false,
          expectedTotalResults: action.payload.expectedTotalResults,
        },
        faceAgingConfiguration: {
          ...state.faceAgingConfiguration,
        },
      };
    }

    case types.FETCH_USER_FACEAGING_RESULTS_ERROR: {
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
          faceAgingIsDone: false,
          isError: true,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
        },
        faceAgingConfiguration: {
          ...state.faceAgingConfiguration,
        },
      };
    }

    case types.FETCH_USER_FACEAGING_RESULT_IMAGE_SUCCESS: {
      const totalResultsProcessed = state.faceAging.currentTotalResults + 1;
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
          results: {
            ...state.faceAging.results,
            [action.payload.age]: {
              ...state.faceAging.results[action.payload.age],
              [action.payload.category]: action.payload.base64Image,
            },
          },
          currentTotalResults: totalResultsProcessed,
          isError: false,
        },
      };
    }

    case types.FETCH_USER_FACEAGING_RESULT_IMAGE_ERROR: {
      const totalResultsProcessed = state.faceAging.currentTotalResults + 1;
      return {
        ...state,
        faceAging: {
          ...state.faceAging,
          currentTotalResults: totalResultsProcessed,
          isError: true,
        },
      };
    }

    case types.FETCH_USER_HEALTH_RESPONSE_START: {
      return {
        ...state,
        fetchHealthResponseCompleted: false,
      };
    }
    case types.FETCH_USER_HEALTH_RESPONSE_SUCCESS: {
      return {
        ...state,
        data: { ...state.data, ...action.payload },
        fetchHealthResponseCompleted: true,
      };
    }
    case types.FETCH_USER_HEALTH_RESPONSE_ERROR: {
      return {
        ...state,
        fetchHealthResponseCompleted: true,
      };
    }

    case types.SUBMIT_USER_HEALTH_RESPONSE_SUCCESS: {
      return {
        ...state,
      };
    }

    case types.SUBMIT_USER_HEALTH_RESPONSE_ERROR: {
      return {
        ...state,
        submittingUserHealthResponse: false,
      };
    }

    case types.SUBMIT_USER_HEALTH_RESPONSE_START: {
      return {
        ...state,
        submittingUserHealthResponse: true,
      };
    }

    case types.SUBMIT_USER_LIFESTYLE_RESPONSE_SUCCESS: {
      return {
        ...state,
        submittingUserLifestyleResponse: false,
      };
    }

    case types.SUBMIT_USER_LIFESTYLE_RESPONSE_ERROR: {
      return {
        ...state,
        submittingUserLifestyleResponse: false,
      };
    }

    case types.SUBMIT_USER_LIFESTYLE_RESPONSE_START: {
      return {
        ...state,
        submittingUserLifestyleResponse: true,
      };
    }

    case types.FETCH_USER_LIFESTYLE_RESPONSE_SUCCESS: {
      const responsesWithValue = Object.keys(action.payload).reduce(
        (responses, currentKey) => {
          const responseValue = action.payload[currentKey];
          return [null, undefined].includes(responseValue)
            ? responses
            : { ...responses, [currentKey]: responseValue };
        },
        {},
      );
      return {
        ...state,
        data: { ...responsesWithValue },
        fetchUserLifestyleResponseCompleted: true,
      };
    }

    case types.FETCH_USER_LIFESTYLE_RESPONSE_ERROR: {
      return {
        ...state,
        fetchUserLifestyleResponseCompleted: true,
      };
    }

    case types.FETCH_USER_LIFESTYLE_RESPONSE_START: {
      return {
        ...state,
        fetchUserLifestyleResponseCompleted: false,
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_START: {
      return {
        ...state,
        healthScore: {
          status: PromiseStatus.START,
          score: undefined,
        },
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_SUCCESS: {
      return {
        ...state,
        healthScore: {
          status: action.payload.status,
          score: action.payload.score,
        },
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_ERROR: {
      return {
        ...state,
        healthScore: {
          status: PromiseStatus.ERROR,
          score: undefined,
        },
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_HISTORY_START: {
      return {
        ...state,
        healthScoreHistory: {
          status: PromiseStatus.START,
          data: undefined,
        },
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_HISTORY_SUCCESS: {
      return {
        ...state,
        healthScoreHistory: {
          status: action.payload.status,
          data: action.payload.data,
        },
      };
    }

    case types.FETCH_USER_HEALTH_SCORE_HISTORY_ERROR: {
      return {
        ...state,
        healthScoreHistory: {
          status: PromiseStatus.ERROR,
          data: undefined,
        },
      };
    }

    case types.FETCH_USER_HEALTH_RESULTS_START: {
      return {
        ...state,
        fetchHealthResultsCompleted: false,
      };
    }
    case types.FETCH_USER_HEALTH_RESULTS_SUCCESS: {
      return {
        ...state,
        results: {
          ...state.results,
          ...action.payload.results,
        },
        hasHealthResults: action.payload.hasHealthResults,
        fetchHealthResultsCompleted: true,
      };
    }
    case types.FETCH_USER_HEALTH_RESULTS_ERROR: {
      return {
        ...state,
        fetchHealthResultsCompleted: true,
      };
    }
    case types.FETCH_USER_LIFESTYLE_RESULTS_START: {
      return {
        ...state,
        fetchUserLifestyleResultsCompleted: false,
        fetchUserLifestyleResultsStatus: PromiseStatus.START,
      };
    }
    case types.FETCH_USER_LIFESTYLE_RESULTS_SUCCESS: {
      return {
        ...state,
        lifestyleResults: {
          ...state.lifestyleResults,
          ...action.payload.results,
        },
        hasLifestyleResults: action.payload.hasLifestyleResults,
        fetchUserLifestyleResultsCompleted: true,
        fetchUserLifestyleResultsStatus: PromiseStatus.SUCCESS,
      };
    }
    case types.FETCH_USER_LIFESTYLE_RESULTS_ERROR: {
      return {
        ...state,
        fetchUserLifestyleResultsCompleted: true,
        fetchUserLifestyleResultsStatus: PromiseStatus.ERROR,
      };
    }
    case types.RESET_LOADER: {
      return {
        ...state,
        fetchUserLifestyleResponseCompleted: false,
        fetchFaceAgingImageCompleted: false,
      };
    }

    case types.DOWNLOAD_FACE_IMAGE_START: {
      return {
        ...state,
        fetchFaceAgingImageCompleted: false,
        fetchingFaceAgingImage: true,
      };
    }

    case types.DOWNLOAD_FACE_IMAGE_SUCCESS: {
      return {
        ...state,
        fetchFaceAgingImageCompleted: true,
        fetchingFaceAgingImage: false,
        faceAging: {
          ...state.faceAging,
          image: action.payload,
        },
      };
    }

    case types.DOWNLOAD_FACE_IMAGE_ERROR: {
      return {
        ...state,
        fetchFaceAgingImageCompleted: true,
        fetchingFaceAgingImage: false,
      };
    }

    case types.DELETE_FACE_IMAGE_SUCCESS: {
      return {
        ...state,
        faceAging: {
          faceAgingIsDone: true,
          expectedTotalResults: 0,
          currentTotalResults: 0,
          results: {},
          image: null,
        },
      };
    }

    case types.FETCH_LIFESTYLE_TIPS_START: {
      return {
        ...state,
        lifestyleTips: {
          tips: {},
          status: PromiseStatus.START,
        },
      };
    }

    case types.FETCH_LIFESTYLE_TIPS_SUCCESS: {
      return {
        ...state,
        lifestyleTips: {
          tips: action.payload,
          status: PromiseStatus.SUCCESS,
        },
      };
    }

    case types.FETCH_LIFESTYLE_TIPS_ERROR: {
      return {
        ...state,
        lifestyleTips: {
          tips: {},
          status: PromiseStatus.ERROR,
        },
      };
    }

    case types.FETCH_PRODUCT_RECOMMENDATIONS_SUCCESS: {
      return {
        ...state,
        productRecommendations: action.payload,
      };
    }

    case types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_START: {
      return {
        ...state,
        productRecommendationsForTips: [],
      };
    }

    case types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_ERROR: {
      return {
        ...state,
        productRecommendationsForTips: [],
      };
    }

    case types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS_SUCCESS: {
      return {
        ...state,
        productRecommendationsForTips: action.payload,
      };
    }

    case types.SET_SUBMIT_LIFESTYLE_FORM_COUNT: {
      return {
        ...state,
        lifestyleFormSubmitCount: state.lifestyleFormSubmitCount + 1,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
