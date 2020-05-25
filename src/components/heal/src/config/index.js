import AppConfig from 'react-native-config';

const { SERVER_HOST } = AppConfig;

const ETPA_HOST = SERVER_HOST + '/etpa';

const Config = {
  ETPA_HOST,
  apiRoutes: {
    getClinics: (
      clientId,
      lat,
      lng,
      page,
      itemPerPage = 20,
      nearBy,
      searchBy,
      searchTerm,
    ) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/Clinics?page=${page}&limit=${itemPerPage}${
        lat ? `&lat=${lat}` : ''
      }${lng ? `&lng=${lng}` : ''}${nearBy ? `&nearBy=${nearBy}` : ''}${
        searchBy ? `&searchBy=${searchBy}` : ''
      }${searchTerm ? `&searchTerm=${searchTerm}` : ''}`,
    getClinicsWithObject: ({
      clientId,
      lat,
      lng,
      page,
      itemPerPage = 20,
      nearBy,
      searchBy,
      searchTerm,
    }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/Clinics?page=${page}&limit=${itemPerPage}${
        lat ? `&lat=${lat}` : ''
      }${lng ? `&lng=${lng}` : ''}${nearBy ? `&nearBy=${nearBy}` : ''}${
        searchBy ? `&searchBy=${searchBy}` : ''
      }${searchTerm ? `&searchTerm=${searchTerm}` : ''}`,
    getDoctors: ({
      clientId,
      page,
      itemPerPage = 20,
      specialityCode,
      searchBy,
      searchTerm,
    }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/Doctors?page=${page}&limit=${itemPerPage}${
        specialityCode ? `&specialityCode=${specialityCode}` : ''
      }${searchBy ? `&searchBy=${searchBy}` : ''}${
        searchTerm ? `&searchTerm=${searchTerm}` : ''
      }`,
    getSpecialities: clientId =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/specialities`,
    getDoctorInfo: ({
      clientId,
      userId,
      clinicProviderId,
      clinicId,
      doctorId,
    }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/doctorinfo?clinicProviderId=${clinicProviderId}&clinicId=${clinicId}&doctorId=${doctorId}`,
    checkInWalkIn: ({ clientId, userId }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/clinic/check-in`,
    scanQRCode: ({ clientId, userId, clinicQrCode }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/clinics/${clinicQrCode}/scan`,
    getMedicalProfile: (clientId, userId) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/medicalprofile`,
    updateMedicalProfile: (clientId, userId) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/medicalprofile/update`,
    getAppointmentList: (clientId, userId) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/appointments`,
    acceptAppointment: (clientId, userId, appointmentId) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/appointments/${appointmentId}/accept`,
    getRemoteTickets: (clientId, userId) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/visits`,
    requestAppointment: ({ clientId, userId }) =>
      `${ETPA_HOST}/api/v2/clients/${clientId}/users/${userId}/appointments/request`,
  },
};

export default Config;
