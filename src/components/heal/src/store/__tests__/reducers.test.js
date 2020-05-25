import reducers from '../reducers';
import * as types from '../types';
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
    selectData: undefined,
  },
  appointmentList: [],
  appointmentTempType: '',
  remoteTickets: [],
  member: {},
};

const withDataInitialState = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  clinicData: {
    clinics: [
      {
        id: 336,
        name: 'Clinic Bukit Rimau',
        latitude: 3.1275345,
        longitude: 101.6412337,
        distanceToClient: 11300034.6201797,
        address: 'Ho Chi Minh City, Vietnam',
        clinicProviderId: 1,
        doctors: [
          {
            id: 322,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
          },
          {
            id: 323,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
          },
        ],
      },
    ],
    page: 0,
    total: 0,
  },
  doctorInfo: {},
  doctorData: {
    doctors: [],
    page: 0,
    total: 0,
    specialityCode: '',
  },
  detailsClinic: {
    id: 336,
    name: 'Clinic Bukit Rimau',
    latitude: 3.1275345,
    longitude: 101.6412337,
    distanceToClient: 11300034.6201797,
    address: 'Ho Chi Minh City, Vietnam',
    clinicProviderId: 1,
    doctors: [
      {
        id: 322,
        locale: 'en-HK',
        name: 'Anna Tan',
        gender: 'Female',
        isActive: true,
        clinics: [],
      },
      {
        id: 323,
        locale: 'en-HK',
        name: 'Anna Tan',
        gender: 'Female',
        isActive: true,
        clinics: [],
      },
    ],
  },
};

describe('Heal reducer', () => {
  it('should return the initialState', () => {
    const state = reducers(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('should handle fetch clinics success', () => {
    const action = {
      type: types.FETCH_CLINICS_SUCCESS,
      payload: {
        totalCount: 2,
        page: 1,
        items: [
          {
            id: 336,
            name: 'Clinic Bukit Rimau',
            latitude: 3.1275345,
            longitude: 101.6412337,
            distanceToClient: 11300034.6201797,
            address: 'Ho Chi Minh City, Vietnam',
            doctors: [
              {
                id: 322,
                locale: 'en-HK',
                name: 'Anna Tan',
                gender: 'Female',
                isActive: true,
                clinics: [],
              },
            ],
          },
          {
            id: 335,
            name: 'Clinic Jelutong Shah Alam',
            latitude: 3.1277049,
            longitude: 101.6416511,
            qrCode: '1771',
            district: 'Shah Alam',
            distanceToClient: 11300080.7479106,
            address: 'Taipei, Taiwan',
            doctors: [
              {
                id: 321,
                locale: 'en-HK',
                name: 'Clinic Jelutong Shah Alam',
                gender: 'Male',
                isActive: true,
                clinics: [],
              },
            ],
          },
        ],
      },
    };

    const expectedData = {
      ...initialState,
      clinicData: {
        total: 2,
        page: 1,
        selectedClinic: {},
        selectedClinics: [],
        clinics: [
          {
            id: 336,
            name: 'Clinic Bukit Rimau',
            latitude: 3.1275345,
            longitude: 101.6412337,
            distanceToClient: 11300034.6201797,
            address: 'Ho Chi Minh City, Vietnam',
            doctors: [
              {
                id: 322,
                locale: 'en-HK',
                name: 'Anna Tan',
                gender: 'Female',
                isActive: true,
                clinics: [],
              },
            ],
          },
          {
            id: 335,
            name: 'Clinic Jelutong Shah Alam',
            latitude: 3.1277049,
            longitude: 101.6416511,
            qrCode: '1771',
            district: 'Shah Alam',
            distanceToClient: 11300080.7479106,
            address: 'Taipei, Taiwan',
            doctors: [
              {
                id: 321,
                locale: 'en-HK',
                name: 'Clinic Jelutong Shah Alam',
                gender: 'Male',
                isActive: true,
                clinics: [],
              },
            ],
          },
        ],
      },
    };

    const reducer = reducers(initialState, action);
    expect(reducer).toEqual(expectedData);
  });

  it('should set details clinic', () => {
    const clinic = {
      id: 336,
      name: 'Clinic Bukit Rimau',
      latitude: 3.1275345,
      longitude: 101.6412337,
      distanceToClient: 11300034.6201797,
      address: 'Ho Chi Minh City, Vietnam',
      clinicProviderId: 1,
      doctors: [
        {
          id: 322,
          locale: 'en-HK',
          name: 'Anna Tan',
          gender: 'Female',
          isActive: true,
          clinics: [],
        },
        {
          id: 323,
          locale: 'en-HK',
          name: 'Anna Tan',
          gender: 'Female',
          isActive: true,
          clinics: [],
        },
      ],
    };
    const action = {
      type: types.SET_DETAILS_CLINIC,
      payload: clinic,
    };

    const expectedData = {
      ...initialState,
      detailsClinic: {
        id: 336,
        name: 'Clinic Bukit Rimau',
        latitude: 3.1275345,
        longitude: 101.6412337,
        distanceToClient: 11300034.6201797,
        address: 'Ho Chi Minh City, Vietnam',
        clinicProviderId: 1,
        doctors: [
          {
            id: 322,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
          },
          {
            id: 323,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
          },
        ],
      },
    };

    const reducer = reducers(initialState, action);
    expect(reducer).toEqual(expectedData);
  });

  it('should handle get doctors info', () => {
    const action = {
      type: types.GET_DOCTORS_INFO_SUCCESS,
      payload: [
        {
          data: {
            isOpen: true,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: true,
            position: 0,
            estimatedConsultationTime: '3:23 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 60,
            id: 322,
            name: null,
            specialityCode: null,
            gender: 'Male',
            email: null,
            imageUrl: null,
            introduction: null,
          },
        },
        {
          data: {
            isOpen: true,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: true,
            position: 0,
            estimatedConsultationTime: '3:23 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 60,
            id: 323,
            name: null,
            specialityCode: null,
            gender: 'Male',
            email: null,
            imageUrl: null,
            introduction: null,
          },
        },
      ],
    };

    const expectedData = {
      ...withDataInitialState,
      detailsClinic: {
        id: 336,
        name: 'Clinic Bukit Rimau',
        latitude: 3.1275345,
        longitude: 101.6412337,
        distanceToClient: 11300034.6201797,
        address: 'Ho Chi Minh City, Vietnam',
        clinicProviderId: 1,
        doctors: [
          {
            id: 322,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
            isOpen: true,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: true,
            position: 0,
            estimatedConsultationTime: '3:23 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 60,
            specialityCode: null,
            email: null,
            imageUrl: null,
            introduction: null,
          },
          {
            id: 323,
            locale: 'en-HK',
            name: 'Anna Tan',
            gender: 'Female',
            isActive: true,
            clinics: [],
            isOpen: true,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: true,
            position: 0,
            estimatedConsultationTime: '3:23 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 60,
            specialityCode: null,
            email: null,
            imageUrl: null,
            introduction: null,
          },
        ],
      },
    };

    const reducer = reducers(withDataInitialState, action);
    expect(reducer).toEqual(expectedData);
  });

  it('it should update location', () => {
    const action = {
      type: types.FETCH_LOCATION_SUCCESS,
      payload: {
        coords: { latitude: 51.50998, longitude: -0.1337 },
      },
    };
    const expectedData = {
      ...initialState,
      location: {
        latitude: 51.50998,
        longitude: -0.1337,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
        changedLocation: true,
      },
    };

    const reducer = reducers(initialState, action);
    expect(reducer).toEqual(expectedData);
  });

  it('it should get walk in select data', () => {
    const action = {
      type: types.SCAN_QR_CODE_SUCCESS,
      payload: {
        clinic: {
          id: 506,
          name: 'Clinic Icity',
          latitude: 3.1267439,
          longitude: 101.6424801,
          qrCode: '2502',
          district: 'Klang',
          area: null,
        },
        doctors: [
          {
            isOpen: false,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: false,
            position: 9999,
            estimatedConsultationTime: '7:30 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 0,
            id: 472,
            name: 'Clinic Icity',
            specialityCode: 'generalpractitio',
            gender: 'Male',
            locale: 'en-HK',
          },
          {
            isOpen: false,
            isRemoteFull: false,
            isRemoteTicketEnabled: true,
            isAppointmentEnabled: true,
            position: 9999,
            estimatedConsultationTime: '7:30 pm',
            ticketDepositAmount: 0.0,
            canGetRefundOnCancellation: false,
            cancellationGraceMinutes: 0,
            id: 463,
            name: 'Yeo An Shin',
            specialityCode: 'generalpractitio',
            gender: 'Male',
            locale: 'en-HK',
          },
        ],
      },
    };
    const expectedData = {
      ...initialState,
      walkIn: {
        qrCodeData: {
          clinic: {
            id: 506,
            name: 'Clinic Icity',
            latitude: 3.1267439,
            longitude: 101.6424801,
            qrCode: '2502',
            district: 'Klang',
            area: null,
          },
          doctors: [
            {
              isOpen: false,
              isRemoteFull: false,
              isRemoteTicketEnabled: true,
              isAppointmentEnabled: false,
              position: 9999,
              estimatedConsultationTime: '7:30 pm',
              ticketDepositAmount: 0.0,
              canGetRefundOnCancellation: false,
              cancellationGraceMinutes: 0,
              id: 472,
              name: 'Clinic Icity',
              specialityCode: 'generalpractitio',
              gender: 'Male',
              locale: 'en-HK',
            },
            {
              isOpen: false,
              isRemoteFull: false,
              isRemoteTicketEnabled: true,
              isAppointmentEnabled: true,
              position: 9999,
              estimatedConsultationTime: '7:30 pm',
              ticketDepositAmount: 0.0,
              canGetRefundOnCancellation: false,
              cancellationGraceMinutes: 0,
              id: 463,
              name: 'Yeo An Shin',
              specialityCode: 'generalpractitio',
              gender: 'Male',
              locale: 'en-HK',
            },
          ],
        },
      },
    };

    const reducer = reducers(initialState, action);
    expect(reducer).toEqual(expectedData);
  });
});
