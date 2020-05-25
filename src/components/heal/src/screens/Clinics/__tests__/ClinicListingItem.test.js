import React from 'react';
import { renderForTest } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';

import ClinicListingItem from '../ClinicListingItem';

const clinicData = {
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
    {
      id: 323,
      locale: 'en-HK',
      name: 'Clinic Bukit Rimau',
      gender: 'Female',
      isActive: true,
      clinics: [],
    },
  ],
};

describe('ClinicListingItem', () => {
  test('Render Clinic Listing Item', async () => {
    const component = renderForTest(<ClinicListingItem clinic={clinicData} />, {
      initialState: {
        heal: { location: { latitude: 0, longitude: 0 } },
      },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
