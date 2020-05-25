import DistrictFilter from '../DistrictFilter';

describe('DistrictFilter', () => {
  const clinics = [
    {
      area: 'Area 1',
      district: 'District 1',
      name: 'Clinic 1',
    },
    {
      area: 'Area 2',
      district: 'District 1',
      name: 'Clinic 2',
    },
  ];
  it('should filter for districts given an area and district', () => {
    const selectedDistrictArea = {
      area: 'Area 1',
      district: 'District 1',
    };
    const districtFilter = new DistrictFilter([
      selectedDistrictArea.area,
      selectedDistrictArea.district,
    ]);

    const filteredClinics = districtFilter.filter(clinics);

    expect(filteredClinics).toEqual([
      {
        area: 'Area 1',
        district: 'District 1',
        name: 'Clinic 1',
      },
    ]);
  });

  it('should return empty array when there is no match', () => {
    const districtFilter = new DistrictFilter(['Area 51', 'District Sky']);

    const actual = districtFilter.filter(clinics);

    expect(actual).toEqual([]);
  });
});
