import React from 'react';
import { Linking, Platform } from 'react-native';
import { render } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import SelectDoctor from '../SelectDoctor';
import { DoctorCard } from '@heal/src/components';

const qrCodeData = {
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
        estimatedConsultationTime: '11:14 pm',
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
        estimatedConsultationTime: '11:14 pm',
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
const clinicQrCode = '2502';

const scanQRCode = jest.fn().mockResolvedValue(qrCodeData);

describe('SelectDoctor', () => {
  test('Render Doctor Card', async () => {
    const [screen] = render(
      <SelectDoctor
        navigation={navigation}
        route={{
          params: { clinicQrCode },
        }}
      />,
      {
        initialState: {
          heal: { walkIn: { qrCodeData } },
        },
        api: { scanQRCode },
      },
    );

    await flushMicrotasksQueue();
    const items = screen.queryAllByType(DoctorCard);
    expect(items).toHaveLength(2);
  });

  it('should press doctor card', async () => {
    const [screen] = render(
      <SelectDoctor
        navigation={navigation}
        route={{
          params: { clinicQrCode },
        }}
      />,
      {
        initialState: {
          heal: { walkIn: { qrCodeData } },
        },
        api: { scanQRCode },
      },
    );

    await flushMicrotasksQueue();

    const items = screen.queryAllByType(DoctorCard);
    fireEvent.press(items[1]);
    expect(items[1].props.selected).toEqual(true);
    expect(items[1].props.showIcon).toEqual(true);
  });
});
