import * as axios from 'axios';
import Config from '@heal/src/config';
import api from '../api';

jest.mock('@services/secureStore', () => ({
  fetchTokens: jest.fn(() => ({
    id_token: 'myidtoken',
    access_token: 'myaccesstoken',
  })),
}));

jest.mock('axios');

test(`should call getClinics`, async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { status: 'success' },
  });
  const clientId = 'twclient3';
  await api.getClinics(clientId, 0, 0, 1, 20);
  expect(axios.get).toHaveBeenCalledWith(
    Config.apiRoutes.getClinics(clientId, 0, 0, 1, 20),
    {
      headers: {
        Authorization: 'Bearer myaccesstoken',
      },
    },
  );
});

test('should call getDoctors', async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { status: 'success' },
  });
  const clientId = 'twclient3';
  await api.getDoctors(clientId, 1, '');
  expect(axios.get).toHaveBeenCalledWith(
    Config.apiRoutes.getDoctors(clientId, 1, 20, ''),
    {
      headers: {
        Authorization: 'Bearer myaccesstoken',
      },
    },
  );
});

test('should call getSpecialities', async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { status: 'success' },
  });
  const clientId = 'twclient3';
  await api.getSpecialities(clientId);
  expect(axios.get).toHaveBeenCalledWith(
    Config.apiRoutes.getSpecialities(clientId),
    {
      headers: {
        Authorization: 'Bearer myaccesstoken',
      },
    },
  );
});

test('should cal getDoctorInfo', async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { status: 'success' },
  });
  const clientId = 'twclient3';
  const userId = 'myUserId';
  const clinicProviderId = 1;
  const doctorId = 1;
  const clinicId = 1;
  await api.getDoctorInfo({
    clientId,
    userId,
    clinicProviderId,
    clinicId,
    doctorId,
  });
  expect(axios.get).toHaveBeenCalledWith(
    Config.apiRoutes.getDoctorInfo({
      clientId,
      userId,
      clinicProviderId,
      clinicId,
      doctorId,
    }),
    {
      headers: {
        Authorization: 'Bearer myaccesstoken',
      },
    },
  );
});

test(`should call scan qr code`, async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: { status: 'success' },
  });
  const clientId = 'twclient3';
  const userId = 'myUserId';
  const clinicQrCode = 'test-qr';

  await api.scanQRCode({
    clientId,
    userId,
    clinicQrCode,
  });
  expect(axios.post).toHaveBeenCalledWith(
    Config.apiRoutes.scanQRCode({
      clientId,
      userId,
      clinicQrCode,
    }),
    undefined,
    {
      headers: {
        Authorization: 'Bearer myaccesstoken',
      },
    },
  );
});
