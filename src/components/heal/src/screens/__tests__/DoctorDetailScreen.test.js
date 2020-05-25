import React from 'react';
import { renderForTest } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import DoctorDetailScreen, { ClinicCard } from '../DoctorDetailScreen';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';
import { chevronUp } from '@heal/images';

const doctor = {
  id: 336,
  locale: 'en-HK',
  name: 'CHAN CHEUNG WAH',
  specialityCode: 'generalsurgery',
  gender: 'NotAvailable',
  isActive: true,
  introduction: 'introduction',
  clinics: [
    {
      id: 331,
      name: 'HealsClinic',
      latitude: 22.277381,
      longitude: 114.185481,
      qrCode: 'HealsClinic',
      district: 'CAUSEWAY BAY',
      openingHours:
        'Sun: 00:00-00:00, 00:00-00:00↵Mon: 08:00-13:00, 14:00-23:00↵Tue: 08:00-13:00, 14:00-23:00↵Wed: 08:00-13:00, 14:00-23:00↵Thu: 08:00-13:00, 14:00-23:00↵Fri: 08:00-13:00, 14:00-23:00↵Sat: 00:00-00:00, 08:00-13:00↵Public Holiday: 00:00-00:00, 00:00-00:00↵',
    },
    {
      id: 340,
      name: 'Heals Day Case Center',
      latitude: 22.277381,
      longitude: 114.185481,
      qrCode: 'HealsDCC',
      district: 'CAUSEWAY BAY',
    },
  ],
};

describe('DoctorDetailScreen', () => {
  test('render inActive doctor', async () => {
    const screen = renderForTest(
      <DoctorDetailScreen
        navigation={navigation}
        route={{
          params: { doctor: { ...doctor, isActive: false } },
        }}
      />,
    );
    await flushMicrotasksQueue();
    const text = screen.getByText('Unavailable');
    expect(text).toBeDefined();
  });

  test('should render correctly', async () => {
    const screen = renderForTest(
      <DoctorDetailScreen
        navigation={navigation}
        route={{
          params: { doctor },
        }}
      />,
    );
    await flushMicrotasksQueue();
    const clinicCards = screen.getAllByType(ClinicCard);
    expect(clinicCards.length).toEqual(2);
    const schedule = screen.getAllByText('Sunday');
    expect(schedule.length).toBeGreaterThanOrEqual(1);
  });

  test('should render correctly with no schedule', async () => {
    const screen = renderForTest(
      <DoctorDetailScreen
        navigation={navigation}
        route={{
          params: {
            doctor: {
              ...doctor,
              clinics: [{ ...doctor.clinics[0], openingHours: null }],
            },
          },
        }}
      />,
    );
    await flushMicrotasksQueue();
    const clinicCards = screen.getAllByType(ClinicCard);
    expect(clinicCards.length).toEqual(1);
    const schedule = screen.queryAllByText('Sunday');
    expect(schedule.length).toEqual(0);
  });

  // test('render red heart icon when press favourite', async () => {
  //   const screen = renderForTest(
  //     <DoctorDetailScreen
  //       navigation={navigation}
  //       route={{ params: { doctor } }}
  //     />,
  //   );
  //   await flushMicrotasksQueue();
  //   const favouriteButton = screen.getByTestId('favourite');
  //   fireEvent.press(favouriteButton);
  //   expect(favouriteButton.props.color).toEqual('#DB0011');
  // });

  test('expand doctor description', async () => {
    const screen = renderForTest(
      <DoctorDetailScreen
        navigation={navigation}
        route={{ params: { doctor } }}
      />,
    );
    await flushMicrotasksQueue();
    const header = screen.getByTestId('expand');
    fireEvent.press(header);
    expect(header.props.source).toEqual(chevronUp);
  });
});
