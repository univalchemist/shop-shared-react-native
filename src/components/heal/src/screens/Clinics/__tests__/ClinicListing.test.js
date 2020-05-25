import React from 'react';
import { render, renderForTest } from '@testUtils';
import navigation from '@testUtils/__mocks__/navigation';
import { flushMicrotasksQueue } from 'react-native-testing-library';

import ClinicListing from '../ClinicListing';
import ClinicListingItem from '../ClinicListingItem';

const clinics = [
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
      {
        id: 323,
        locale: 'en-HK',
        name: 'Clinic Bukit Rimau',
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
  {
    id: 333,
    name: 'Clinic Subang',
    latitude: 3.1259714,
    longitude: 101.6423915,
    qrCode: '2554',
    district: 'Subang Jaya',
    distanceToClient: 11300165.1150293,
    address: 'New York, USA',
    doctors: [
      {
        id: 317,
        locale: 'en-HK',
        name: 'Shantini',
        gender: 'Female',
        isActive: true,
        clinics: [],
      },
      {
        id: 318,
        locale: 'en-HK',
        name: 'Clinic Subang',
        gender: 'Male',
        isActive: true,
        clinics: [],
      },
    ],
  },
];

const getClinics = jest
  .fn()
  .mockResolvedValue({ data: { items: clinics, totalCount: 3, page: 1 } });

describe('ClinicListing', () => {
  test('Render Clinic Listing', async () => {
    // const [screen] = render(<ClinicListing navigation={navigation} />, {
    //   initialState: {
    //     heal: { clinicData: { clinics: [], page: 0, total: 0 } },
    //   },
    //   api: { getClinics },
    // });

    // await flushMicrotasksQueue();
    // const items = screen.queryAllByType(ClinicListingItem);
    // expect(items).toHaveLength(3);

    const component = renderForTest(<ClinicListing navigation={navigation} />, {
      initialState: {
        heal: { clinicData: { clinics: [], page: 0, total: 0 } },
      },
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
