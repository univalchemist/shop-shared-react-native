import * as actions from '../actions';
import * as types from '../types';
import { configureMockStore, configureStore } from '@testUtils';
import { PromiseStatus } from '@middlewares';
import { flushMicrotasksQueue } from 'react-native-testing-library';

const initialState = {
  user: {
    clientId: 'testClient',
    userId: 'client-001',
  },
  heal: {
    searchResult: [{}, {}],
    location: {
      latitude: 0,
      longitude: 0,
    },
    clinicData: {
      page: 0,
    },
    detailsClinic: {},
    doctorData: {
      doctors: [],
      page: 0,
      total: 0,
      specialityCode: '',
    },
    doctorInfo: {},
    walkIn: {
      selectData: [],
    },
  },
};

const api = {
  getClinicsWithObject: jest.fn(() => ({
    data: {
      totalCount: 2,
      page: 1,
      items: [
        {
          id: 336,
          name: 'Clinic Bukit Rimau',
          latitude: 3.1275345,
          longitude: 101.6412337,
          distanceToClient: 11300034.6201797,
          location: {
            latitude: 3.1275345,
            longitude: 101.6412337,
          },
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
          location: {
            latitude: 3.1277049,
            longitude: 101.6412337,
          },
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
  })),
  getClinics: jest.fn(() => ({
    data: {
      totalCount: 2,
      page: 1,
      items: [
        {
          id: 336,
          name: 'Clinic Bukit Rimau',
          latitude: 3.1275345,
          longitude: 101.6412337,
          distanceToClient: 11300034.6201797,
          location: {
            latitude: 3.1275345,
            longitude: 101.6412337,
          },
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
          location: {
            latitude: 3.1277049,
            longitude: 101.6412337,
          },
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
  })),
  getDoctorInfo: jest.fn(
    ({ clientId, userId, clinicProviderId, clinicId, doctorId }) => ({
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
        id: doctorId,
        name: null,
        specialityCode: null,
        gender: 'Male',
        email: null,
        imageUrl: null,
        introduction: null,
      },
    }),
  ),
  getSpecialities: jest.fn().mockResolvedValue({
    data: {
      totalCount: 4,
      page: 1,
      items: [
        { name: 'generalsurgery', code: 'generalsurgery' },
        { name: 'generalpractitio', code: 'generalpractitio' },
        { name: 'dentist', code: 'dentist' },
        { name: 'cxaSpeciality', code: 'cxaSpeciality' },
      ],
    },
  }),
  scanQRCode: jest.fn().mockResolvedValue({
    data: {
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
  }),
};

describe('getClinics', () => {
  it('should fetch location', () => {
    global.navigator = {
      geolocation: {
        getCurrentPosition: jest.fn().mockImplementation(successCallback => {
          successCallback({
            coords: {
              latitude: 2,
              longitude: 3,
            },
          });
        }),
      },
    };

    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_LOCATION_START },
      {
        type: types.FETCH_LOCATION_SUCCESS,
        payload: {
          coords: {
            latitude: 2,
            longitude: 3,
          },
        },
      },
    ];

    return store.dispatch(actions.fetchLocation()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  it('should create action to get clinics data', () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.FETCH_CLINICS_START },
      {
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
              location: {
                latitude: 3.1275345,
                longitude: 101.6412337,
              },
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
              location: {
                latitude: 3.1277049,
                longitude: 101.6416511,
              },
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
      },
    ];
    return store.dispatch(actions.getClinics()).then(() => {
      expect(api.getClinicsWithObject).toHaveBeenCalledTimes(1);
      expect(api.getClinicsWithObject).toHaveBeenCalledWith({
        clientId: 'testClient',
        lat: 0,
        lng: 0,
        page: 1,
      });
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('fetch specialities', async () => {
    const store = configureMockStore(api)(initialState);
    const expectedActions = [
      { type: types.GET_SPECIALITIES_START },
      {
        type: types.GET_SPECIALITIES_SUCCESS,
        payload: {
          totalCount: 4,
          page: 1,
          items: [
            { name: 'generalsurgery', code: 'generalsurgery' },
            { name: 'generalpractitio', code: 'generalpractitio' },
            { name: 'dentist', code: 'dentist' },
            { name: 'cxaSpeciality', code: 'cxaSpeciality' },
          ],
        },
      },
    ];
    return store.dispatch(actions.getSpecialities()).then(() => {
      expect(api.getSpecialities).toBeCalledTimes(1);
      expect(api.getSpecialities).toBeCalledWith(initialState.user.clientId);
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('clearSearch', async () => {
    const store = configureStore(api, initialState);
    store.dispatch(actions.clearSearch());
    expect(store.getState().heal.searchResult.length).toEqual(0);
  });
});

describe('setDetailsClinic', () => {
  it('should create action to set details clinic', async () => {
    const store = configureMockStore(api)(initialState);
    const clinic = {
      id: 336,
      name: 'Clinic Bukit Rimau',
      latitude: 3.1275345,
      longitude: 101.6412337,
      distanceToClient: 11300034.6201797,
      location: {
        latitude: 3.1275345,
        longitude: 101.6412337,
      },
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
    };
    const expectedActions = [
      {
        type: types.SET_DETAILS_CLINIC,
        payload: {
          id: 336,
          name: 'Clinic Bukit Rimau',
          latitude: 3.1275345,
          longitude: 101.6412337,
          distanceToClient: 11300034.6201797,
          location: {
            latitude: 3.1275345,
            longitude: 101.6412337,
          },
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
      },
    ];

    await store.dispatch(actions.setDetailsClinic(clinic));
    await flushMicrotasksQueue();
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('getDoctorsInfo', () => {
  it('should create action to get doctors info', () => {
    const store = configureMockStore(api)(initialState);
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
    const expectedActions = [
      { type: types.GET_DOCTORS_INFO_START },
      {
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
      },
    ];
    return store.dispatch(actions.getDoctorsInfo(clinic)).then(() => {
      expect(api.getDoctorInfo).toHaveBeenCalledTimes(clinic.doctors.length);
      clinic.doctors.forEach(doctor => {
        expect(api.getDoctorInfo).toHaveBeenCalledWith({
          clientId: initialState.user.clientId,
          userId: initialState.user.userId,
          clinicProviderId: clinic.clinicProviderId,
          clinicId: clinic.id,
          doctorId: doctor.id,
        });
      });
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('scanQRCode', () => {
  it('should create action to scan qr code', () => {
    const store = configureMockStore(api)(initialState);
    const clinicQrCode = 'qrCode';
    const expectedActions = [
      { type: types.SCAN_QR_CODE_START },
      {
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
          clinicQrCode: 'qrCode',
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
    ];
    return store.dispatch(actions.scanQRCode(clinicQrCode)).then(() => {
      expect(api.scanQRCode).toHaveBeenCalledTimes(1);
      expect(api.scanQRCode).toHaveBeenCalledWith({
        clientId: initialState.user.clientId,
        userId: initialState.user.userId,
        clinicQrCode,
      });
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
