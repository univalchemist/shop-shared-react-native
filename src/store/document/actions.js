import * as types from './types';
import Config from '@config';

const transformDocuments = (clientId, documents) => {
  return documents.map(doc => ({
    ...doc,
    url: Config.apiRoutes.getDocument(clientId, doc.id),
  }));
};

export const getDocuments = () => (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId } = getState().user;
    const response = await api.getDocuments(clientId);
    const transformedData = transformDocuments(clientId, response.data);
    return transformedData;
  };

  return dispatch({
    type: types.FETCH_DOCUMENTS,
    payload: getPromise(),
  });
};
