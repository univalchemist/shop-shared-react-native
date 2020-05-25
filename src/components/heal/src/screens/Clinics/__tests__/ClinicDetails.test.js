import React from 'react';
import { Linking, Platform } from 'react-native';
import { render } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import ClinicDetails from '../ClinicDetails';
import { DoctorCard } from '@heal/src/components';

const detailsClinic = {
  id: 532,
  name: 'Clinic Icity',
  latitude: 3.1267439,
  longitude: 101.6424801,
  qrCode: '2502',
  district: 'Klang',
  distanceToClient: 11300173.986425,
  address: '2502, JALAN ICITY',
  openingHours:
    'Sun: 00:00-00:00, 00:00-00:00\nMon: 08:00-13:00, 14:00-23:00\nTue: 08:00-13:00, 14:00-23:00\nWed: 08:00-13:00, 14:00-23:00\nThu: 08:00-13:00, 14:00-23:00\nFri: 08:00-13:00, 14:00-23:00\nSat: 00:00-00:00, 08:00-13:00\nPublic Holiday: 00:00-00:00, 00:00-00:00\n',
  clinicProviderId: 1,
  isActive: true,
  phoneNumber: '0703610700',
  doctors: [
    {
      id: 322,
      locale: 'en-HK',
      name: 'Yeo An Shin',
      gender: 'Male',
      isActive: true,
      clinics: [],
      clinicProviderId: 1,
    },
    {
      id: 323,
      locale: 'en-HK',
      name: 'Clinic Icity',
      gender: 'Male',
      isActive: true,
      clinics: [],
      clinicProviderId: 1,
    },
  ],
};

const doctorsInfo = [
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
];

const getDoctorsInfo = jest.fn().mockResolvedValue(doctorsInfo);

describe('ClinicDetails', () => {
  test('Render Doctor Card', async () => {
    const [screen] = render(
      <ClinicDetails
        navigation={navigation}
        route={{
          params: { clinic: detailsClinic },
        }}
      />,
      {
        initialState: {
          heal: { detailsClinic },
        },
        api: { getDoctorsInfo },
      },
    );

    await flushMicrotasksQueue();
    const items = screen.queryAllByType(DoctorCard);
    expect(items).toHaveLength(2);
  });

  it('should press phone button', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const [screen] = render(
      <ClinicDetails
        navigation={navigation}
        route={{
          params: { clinic: detailsClinic },
        }}
      />,
      {
        initialState: {
          heal: { detailsClinic },
        },
        api: { getDoctorsInfo },
      },
    );

    await flushMicrotasksQueue();

    const button = screen.getByTestId('telephone');
    fireEvent.press(button);

    expect(Linking.openURL).toHaveBeenCalledWith(
      `tel:${detailsClinic.phoneNumber}`,
    );
  });

  it('should press navigation button on iOS', async () => {
    Platform.OS = 'ios';

    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const [screen] = render(
      <ClinicDetails
        navigation={navigation}
        route={{
          params: { clinic: detailsClinic },
        }}
        platform="ios"
      />,
      {
        initialState: {
          heal: { detailsClinic },
        },
        api: { getDoctorsInfo },
      },
    );

    await flushMicrotasksQueue();

    const button = screen.getByTestId('navigation');
    fireEvent.press(button);

    const labelName = 'Clinic Icity';
    const location = `3.1267439,101.6424801`;

    expect(Linking.openURL).toHaveBeenCalledWith(
      `maps:0,0?q=${labelName}@${location}`,
    );
  });

  it('should press navigation button on Android', async () => {
    Platform.OS = 'android';

    jest.spyOn(Linking, 'openURL').mockImplementation(() => jest.fn());
    const [screen] = render(
      <ClinicDetails
        navigation={navigation}
        route={{
          params: { clinic: detailsClinic },
        }}
        platform="android"
      />,
      {
        initialState: {
          heal: { detailsClinic },
        },
        api: { getDoctorsInfo },
      },
    );

    await flushMicrotasksQueue();

    const button = screen.getByTestId('navigation');
    fireEvent.press(button);

    const labelName = 'Clinic Icity';
    const location = `3.1267439,101.6424801`;

    expect(Linking.openURL).toHaveBeenCalledWith(
      `maps:0,0?q=${location}(${labelName})`,
    );
  });

  it('should press doctor card', async () => {
    const [screen] = render(
      <ClinicDetails
        navigation={navigation}
        route={{
          params: { clinic: detailsClinic },
        }}
      />,
      {
        initialState: {
          heal: { detailsClinic },
        },
        api: { getDoctorsInfo },
      },
    );

    await flushMicrotasksQueue();

    const items = screen.queryAllByType(DoctorCard);
    fireEvent.press(items[1]);
    expect(items[1].props.selected).toEqual(true);
  });
});
