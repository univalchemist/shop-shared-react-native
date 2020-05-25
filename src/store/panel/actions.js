import * as types from './types';

const transformClinicForCluster = clinics => {
  const data = clinics.map(clinic => ({
    ...clinic,
    location: { longitude: clinic.longitude, latitude: clinic.latitude },
  }));
  return data;
};

export const fetchPanelClinics = () => async (dispatch, getState, { api }) => {
  const getPromise = async () => {
    const { clientId, userId } = getState().user;
    const response = await api.fetchPanelClinics(clientId, userId);
    if (response.data) {
      response.data = transformClinicForCluster(response.data);
      response.data.map(clinic => {
        !clinic.specialty && (clinic.specialty = clinic.consultationType);
        clinic.name = clinic.name.trim();
        return clinic;
      });
    }
    return response.data;
  };

  return dispatch({
    type: types.FETCH_PANEL_CLINICS,
    payload: getPromise(),
  });
};

export const updateSelectedClinic = clinic => dispatch => {
  return dispatch({
    type: types.UPDATE_SELECTED_CLINIC,
    payload: clinic,
  });
};

export const updateSelectedClinics = clinics => dispatch => {
  return dispatch({
    type: types.UPDATE_SELECTED_CLINICS,
    payload: clinics,
  });
};

export const updateFilter = updatedFilter => dispatch => {
  return dispatch({
    type: types.UPDATE_FILTERS,
    payload: updatedFilter,
  });
};

export const clearClinics = () => {
  return {
    type: types.CLEAR_PANEL_CLINICS,
    payload: [],
  };
};

export const removeAllFilters = () => dispatch => {
  return dispatch({
    type: types.REMOVE_ALL_FILTERS,
  });
};
