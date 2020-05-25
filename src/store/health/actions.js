import * as types from './types';
import { PromiseStatus } from '@middlewares';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { ProductRecommendationRiskMapping } from '@screens/Health/components/LifestyleTipsModal/ProductRecommendationRiskMapping';

const { Buffer } = require('buffer/');

export const fetchUserLifestyleResponse = () => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    let response = await api.getUserLifestyleResponse(clientId, userId);
    const responseData = response.data;
    if (responseData !== undefined) {
      const isAsian =
        responseData.ethnicity === 'SouthAsian' ||
        responseData.ethnicity === 'EastAsian';
      response.data.isAsian = isAsian;
    }
    return response.data;
  };

  return dispatch({
    type: types.FETCH_USER_LIFESTYLE_RESPONSE,
    payload: getPromise(),
  });
};

export const submitUserLifestyleResponse = values => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { image, ...healthdata } = values;
    const { clientId, userId } = getState().user;

    const uploadedImage = getState().health.faceAging.image;
    const shouldDeleteImage = !(!uploadedImage && !image);

    healthdata.ethnicity = healthdata.isAsian ? 'EastAsian' : 'Other';

    const response = await api.submitUserLifestyleResponse(
      clientId,
      userId,
      healthdata,
    );

    if (image) {
      try {
        await dispatch(uploadFaceAgingPhoto(image));
      } catch (error) {
        return { error, type: 'upload_failed' };
      }
    } else if (shouldDeleteImage) {
      try {
        await dispatch(deleteFaceAgingPhoto());
      } catch (error) {
        return { error, type: 'delete_failed' };
      }
    }

    dispatch(fetchUserLifestyleResults());
    dispatch(fetchLifestyleTips());

    return response;
  };

  return dispatch({
    type: types.SUBMIT_USER_LIFESTYLE_RESPONSE,
    payload: getPromise(),
  });
};

export const fetchUserLifestyleResults = () => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getUserLifestyleResults(clientId, userId);
    return {
      hasLifestyleResults:
        !!response.data && Object.keys(response.data).length > 0,
      results: response.data,
    };
  };

  return dispatch({
    type: types.FETCH_USER_LIFESTYLE_RESULTS,
    payload: getPromise(),
  });
};

const getImageToUpload = async image => {
  if (Platform.OS === 'android' && image.uri.includes('base64')) {
    const tempFileDirectory = `${FileSystem.cacheDirectory}uploadTmp`;
    let { exists } = await FileSystem.getInfoAsync(tempFileDirectory);
    if (!exists)
      await FileSystem.makeDirectoryAsync(tempFileDirectory, {
        intermediates: true,
      });

    const tempFilePath = `${tempFileDirectory}${Date.now()}.jpg`;
    const base64EncodedData = image.uri.split(',')[1];
    await FileSystem.writeAsStringAsync(tempFilePath, base64EncodedData, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return tempFilePath;
  } else return image.uri;
};

export const uploadFaceAgingPhoto = image => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const imagePath = await getImageToUpload(image);

    var imageToUpload = {
      uri: imagePath,
      type: 'image/jpeg',
      fileName: 'image.jpg',
    };
    const response = await api.uploadFaceAgingPhoto(
      clientId,
      userId,
      imageToUpload,
    );
    if (response && response.status === 200) {
      dispatch(getUserFaceAgingResults());
    }
  };

  return dispatch({
    type: types.UPLOAD_FACE_IMAGE,
    payload: getPromise(),
  });
};

export const getUserHealthScore = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getUserHealthScore(clientId, userId);
    if (response.status === 204 || !response.data) {
      return {
        status: PromiseStatus.ERROR,
        score: undefined,
      };
    }

    return {
      status: PromiseStatus.SUCCESS,
      score: response.data.score,
    };
  };

  return dispatch({
    type: types.FETCH_USER_HEALTH_SCORE,
    payload: getPromise(),
  });
};

export const getUserHealthScoreHistory = () => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getUserHealthScoreHistory(clientId, userId);

    if (
      response.status === 204 ||
      !response.data ||
      response.data.length === 0
    ) {
      return {
        status: PromiseStatus.ERROR,
        data: undefined,
      };
    }

    if (response.data) {
      response.data.sort((currentClinic, nextClinic) =>
        currentClinic.createdOn.localeCompare(nextClinic.createdOn),
      );
    }

    return {
      status: PromiseStatus.SUCCESS,
      data: response.data,
    };
  };

  return dispatch({
    type: types.FETCH_USER_HEALTH_SCORE_HISTORY,
    payload: getPromise(),
  });
};

export const getUserFaceAgingResults = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const {
      reattemptFrequencyInSeconds,
      maxReattempts,
    } = getState().health.faceAgingConfiguration;
    let pollingAttempts = 0;

    const fetchAgingResults = async () => {
      const response = await api.getUserFaceAgingResults(clientId, userId);
      if (response.status === 204 || !response.data) {
        return {
          faceAgingIsDone: true,
          expectedTotalResults: 0,
        };
      }

      let faceAgingIsDone = response.data.faceAgingIsDone;
      if (faceAgingIsDone) {
        pollingAttempts = 0;
        const { results } = response.data;
        if (results) {
          results.forEach(result => {
            if (result) {
              dispatch(getUserFaceAgingResultImage(result));
            }
          });
        }
        return {
          faceAgingIsDone,
          expectedTotalResults: response.data.results.length,
        };
      } else return null;
    };

    let faceAgingIsDone = false;
    let data = await fetchAgingResults();
    while (!data && pollingAttempts < maxReattempts) {
      pollingAttempts++;
      await new Promise(r => setTimeout(r, reattemptFrequencyInSeconds * 1000));
      data = await fetchAgingResults();
    }
    if (pollingAttempts == maxReattempts) faceAgingIsDone = true;
    if (!data) {
      data = {
        faceAgingIsDone,
        expectedTotalResults: 0,
        isError: true,
      };
    }
    return data;
  };

  return dispatch({
    type: types.FETCH_USER_FACEAGING_RESULTS,
    payload: getPromise(),
  });
};

export const getUserFaceAgingResultImage = ({ age, category }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getUserFaceAgingResultImage(
      clientId,
      userId,
      age,
      category,
    );

    /* istanbul ignore next */
    const base64Image = `data:image/jpeg;base64,${Buffer.from(
      response.data,
      'binary',
    ).toString('base64')}`;

    return {
      age,
      category,
      base64Image,
    };
  };

  return dispatch({
    type: types.FETCH_USER_FACEAGING_RESULT_IMAGE,
    payload: getPromise(),
  });
};

export const resetLoader = () => dispatch => {
  return dispatch({
    type: types.RESET_LOADER,
  });
};

export const downloadFaceAgingPhoto = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.downloadFaceAgingPhoto(clientId, userId);
    if (response.data.byteLength == 0) return null;
    return convertToBase64(response);
  };

  return dispatch({
    type: types.DOWNLOAD_FACE_IMAGE,
    payload: getPromise(),
  });
};

export const fetchLifestyleTips = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getLifestyleTips(clientId, userId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_LIFESTYLE_TIPS,
    payload: getPromise(),
  });
};

export const deleteFaceAgingPhoto = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    await api.deleteFaceAgingPhoto(clientId, userId);
  };

  return dispatch({
    type: types.DELETE_FACE_IMAGE,
    payload: getPromise(),
  });
};

export const fetchProductRecommendations = () => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getProductRecommendations(clientId, userId);
    return response.data;
  };

  return dispatch({
    type: types.FETCH_PRODUCT_RECOMMENDATIONS,
    payload: getPromise(),
  });
};

export const fetchProductRecommendationsForTips = ({ tipCategory }) => (
  dispatch,
  getState,
  { api },
) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.getProductRecommendationsForTips(
      clientId,
      userId,
      ProductRecommendationRiskMapping[tipCategory],
    );
    return response.data;
  };

  return dispatch({
    type: types.FETCH_PRODUCT_RECOMMENDATIONS_FOR_TIPS,
    payload: getPromise(),
  });
};

export const setSubmitLifestyleFormCount = () => dispatch => {
  return dispatch({
    type: types.SET_SUBMIT_LIFESTYLE_FORM_COUNT,
  });
};

const convertToBase64 = response => {
  const base64Image = `data:image/jpeg;base64,${Buffer.from(
    response.data,
    'binary',
  ).toString('base64')}`;
  return { uri: base64Image };
};
