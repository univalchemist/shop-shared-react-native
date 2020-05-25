import React from 'react';
import { getAreaDistrictList } from '../getAreaDistrictList';
import messages from '@messages/en-HK.json';

describe('getAreaDistrictList', () => {
  const intl = {
    formatMessage: ({ id }) => messages[id],
  };

  it('should render trimmed areas and districts', () => {
    const mockClinics = [
      {
        name: 'Clinic A',
        area: '   Area 1',
        district: 'District 1  ',
      },
    ];

    const areaDistrictList = getAreaDistrictList(intl, mockClinics);

    const expected = [
      { title: messages['panelSearch.search.areas'], data: ['Area 1'] },
      {
        title: `${messages['panelSearch.search.districts']} - Area 1`,
        data: ['District 1'],
      },
    ];

    expect(areaDistrictList).toEqual(expected);
  });

  it('should render list areas and districts alphabetically', () => {
    const mockClinics = [
      {
        name: 'Clinic A',
        area: 'Area 2',
        district: 'District 3',
      },
      {
        name: 'Clinic B',
        area: 'Area 1',
        district: 'District 1',
      },
      {
        name: 'Clinic C',
        area: 'Area 2',
        district: 'District 2',
      },
    ];

    const areaDistrictList = getAreaDistrictList(intl, mockClinics);

    const expected = [
      {
        title: messages['panelSearch.search.areas'],
        data: ['Area 1', 'Area 2'],
      },
      {
        title: `${messages['panelSearch.search.districts']} - Area 1`,
        data: ['District 1'],
      },
      {
        title: `${messages['panelSearch.search.districts']} - Area 2`,
        data: ['District 2', 'District 3'],
      },
    ];

    expect(areaDistrictList).toEqual(expected);
  });
});
