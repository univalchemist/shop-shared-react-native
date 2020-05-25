import * as types from './types';

export const fetchClaimTypes = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const {
      user: { clientId, userId },
    } = getState();
    const response = await api.getClaimTypes(clientId, userId);
    const claimCategories = response.data;
    const categories = {
      all: [],
      byId: {},
    };
    const types = {
      byId: {},
    };
    const reasons = {
      byId: {},
    };

    claimCategories.forEach(cat => {
      const { claimTypes, ...category } = cat;
      const claimTypeIds = [];

      claimTypes.forEach(({ claimReasons, ...type }) => {
        const claimReasonIds = [];
        claimReasons.forEach(reason => {
          reasons.byId[reason.id] = reason;
          claimReasonIds.push(reason.id);
        });
        type.isInsuranceClaim = category.isInsuranceClaim;
        type.claimReasonIds = claimReasonIds;
        type.claimCategoryId = category.id;
        types.byId[type.id] = type;
        claimTypeIds.push(type.id);
      });

      category.claimTypeIds = claimTypeIds;
      categories.byId[category.id] = category;
      categories.all.push(category.id);
    });

    return {
      categories,
      types,
      reasons,
    };
  };

  return dispatch({
    type: types.FETCH_CLAIM_TYPES,
    payload: getPromise(),
  });
};
