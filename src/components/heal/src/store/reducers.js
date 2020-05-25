import * as types from './types';
import {
  appointmentCalendar,
  appointmentCancel,
  appointmentFinish,
  appointmentTimer,
} from '@heal/images';
const initialState = {
  searchResult: [],
  location: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
    changedLocation: false,
  },
  clinicData: {
    searchTerm: null,
    searchBy: null,
    clinics: [],
    page: 0,
    total: 0,
    selectedClinic: {},
    selectedClinics: [],
  },
  doctorInfo: {},
  doctorData: {
    doctors: [],
    page: 0,
    total: 0,
    specialityCode: '',
  },
  detailsClinic: {},
  walkIn: {
    checkedInData: {},
    qrCodeData: {},
    selectData: undefined,
  },
  appointmentList: [],
  appointmentTempType: '',
  remoteTickets: [],
  member: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLINICS_SUCCESS: {
      const data = action.payload;
      let clinics = state.clinicData.clinics;
      let page = state.clinicData.page;
      let total = state.clinicData.total;
      let searchTerm = state.clinicData.searchTerm;
      let searchBy = state.clinicData.searchBy;
      let forceReload = state.clinicData.forceReload;

      if (forceReload) {
        clinics = [...clinics, ...data.items];
      } else {
        if (searchTerm !== data.searchTerm || searchBy !== data.searchBy) {
          searchBy = data.searchBy;
          searchTerm = data.searchTerm;
          clinics = data.items;
        } else if (page < data.page && data.items?.length > 0) {
          clinics = [...clinics, ...data.items];
        }
      }

      page = data.page;
      if (!!data.totalCount && data.totalCount > 0) total = data.totalCount;

      return {
        ...state,
        clinicData: {
          ...state.clinicData,
          clinics,
          total,
          page,
          searchTerm,
          searchBy,
        },
        location: {
          ...state.location,
          changedLocation: false,
        },
      };
    }
    case types.FETCH_LOCATION_SUCCESS: {
      const { coords } = action.payload;
      const { latitude, longitude } = coords;
      const changedLocation =
        state.location.latitude === 0 && state.location.longitude === 0;

      return {
        ...state,
        location: { ...state.location, latitude, longitude, changedLocation },
      };
    }
    case types.GET_DOCTORS_SUCCESS:
      const data = action.payload;
      let doctors = state.doctorData.doctors;
      let page = state.doctorData.page;
      let total = state.doctorData.total;
      let specialityCode = state.doctorData.specialityCode;

      if (specialityCode !== data.specialityCode) {
        specialityCode = data.specialityCode;
        doctors = data.items;
      } else if (state.doctorData.page < data.page && data.items?.length > 0)
        doctors = [...state.doctorData.doctors, ...data.items];

      page = data.page;
      if (!!data.totalCount && data.totalCount > 0) total = data.totalCount;

      return {
        ...state,
        doctorData: {
          ...state.doctorData,
          doctors,
          page,
          total,
          specialityCode,
        },
      };
    case types.GET_DOCTOR_DETAIL_SUCCESS:
      return state;
    case types.GET_SPECIALITIES_SUCCESS:
      return {
        ...state,
        specialities: action.payload,
        specialitiesByCode: action.payload.reduce((accumulator, item) => {
          accumulator[item.code] = item;
          return accumulator;
        }, {}),
      };
    case types.SEARCH_SUCCESS:
      return {
        ...state,
        searchResult: action.payload,
      };
    case types.CLEAR_SEARCH:
      return {
        ...state,
        searchResult: [],
      };
    case types.UPDATE_SELECTED_CLINICS:
      return {
        ...state,
        clinicData: {
          ...state.clinicData,
          selectedClinics: action.payload,
        },
      };
    case types.UPDATE_CLINIC_PAGE:
      return {
        ...state,
        clinicData: {
          ...state.clinicData,
          page: 0,
          clinics: [],
        },
      };
    case types.GET_DOCTORS_INFO_SUCCESS: {
      const doctorsInfo = action.payload;
      const doctors = state.detailsClinic.doctors;
      let newDoctors = [];

      for (let i = 0; i < doctorsInfo.length; i += 1) {
        const doctorInfo = doctorsInfo[i].data;
        for (let j = 0; j < doctors.length; j += 1) {
          let doctor = doctors[j];
          if (doctorInfo.id === doctor.id) {
            doctor = { ...doctorInfo, ...doctor };
            newDoctors.push(doctor);
            break;
          }
        }
      }

      return {
        ...state,
        detailsClinic: {
          ...state.detailsClinic,
          doctors: newDoctors,
        },
      };
    }
    case types.SET_DETAILS_CLINIC: {
      return {
        ...state,
        detailsClinic: action.payload,
      };
    }

    case types.SCAN_QR_CODE_SUCCESS: {
      return {
        ...state,
        clinicQrCode: action.payload.clinicQrCode,
        walkIn: {
          qrCodeData: action.payload,
        },
      };
    }

    case types.GET_WALKIN_SELECTS:
      return {
        ...state,
        walkIn: {
          selectData: action.payload,
        },
      };

    case types.CHECK_IN_WALK_IN_SUCCESS: {
      return state;
    }

    case types.GET_MEDICAL_PROFILE_SUCCESS:
      return {
        ...state,
        medicalProfileData: action.payload,
      };

    case types.GET_APPOINTMENT_LIST:
      return {
        ...state,
        appointmentList: action.payload,
      };
    case types.GET_REMOTE_TICKETS_SUCCESS:
      return {
        ...state,
        remoteTickets: action.payload,
      };

    case types.GET_MEMBER_SUCCESS: {
      return {
        ...state,
        member: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
