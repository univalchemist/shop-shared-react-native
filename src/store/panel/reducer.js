import * as types from './types';
import { PanelClinicFilters } from '@screens/Panel/utils/filter';

const initialState = {
  defaultLocation: {
    latitude: 22.266021,
    longitude: 114.186422,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  },
  clinics: [],
  filteredClinics: [],
  selectedClinic: undefined,
  selectedClinics: [],
  filters: new PanelClinicFilters({}),
  specialty: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PANEL_CLINICS_SUCCESS: {
      const specialty = Array.from(
        action.payload.reduce((accumulator, { specialty }) => {
          accumulator.add(specialty);
          return accumulator;
        }, new Set()),
      );
      const clinics = action.payload;

      return {
        ...state,
        clinics: clinics,
        selectedClinic: clinics[0],
        selectedClinics: [],
        filteredClinics: clinics,
        specialty,
      };
    }
    case types.UPDATE_SELECTED_CLINIC: {
      return {
        ...state,
        selectedClinic: action.payload,
      };
    }
    case types.UPDATE_FILTERS: {
      state.filters.update(action.payload);
      const filteredClinics = state.filters.apply(state.clinics);
      return {
        ...state,
        filteredClinics,
        selectedClinic: filteredClinics[0],
        selectedClinics: [],
      };
    }
    case types.CLEAR_PANEL_CLINICS: {
      state.filters.removeAll();
      return {
        ...state,
        clinics: [],
        filteredClinics: [],
        selectedClinic: undefined,
        specialty: [],
        selectedClinics: [],
      };
    }
    case types.REMOVE_ALL_FILTERS: {
      state.filters.removeAll();
      return {
        ...state,
        filteredClinics: state.clinics,
        selectedClinic: state.clinics[0],
        selectedClinics: [],
      };
    }

    case types.UPDATE_SELECTED_CLINICS: {
      return {
        ...state,
        selectedClinics: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
