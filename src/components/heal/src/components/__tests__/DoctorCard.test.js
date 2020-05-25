import React from 'react';
import { renderForTest } from '@testUtils';

import DoctorCard from '../DoctorCard';

const doctorData = {
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
};

const DOCTOR_CARD_WIDTH = 190;
const DOCTOR_CARD_HEIGHT = 314;

describe('ClinicListingItem', () => {
  test('Render Clinic Listing Item', async () => {
    const component = renderForTest(
      <DoctorCard
        doctor={doctorData}
        width={DOCTOR_CARD_WIDTH}
        height={DOCTOR_CARD_HEIGHT}
      />,
      {
        initialState: {},
      },
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
