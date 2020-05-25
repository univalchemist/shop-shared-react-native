import SearchAllFilter from '../SearchAllFilter';

describe('SearchAllFilter', () => {
  it('should construct searchTerm from value', () => {
    const values = 'value';
    const instance = new SearchAllFilter(values);
    expect(instance.searchTerm).toEqual(values[0].toUpperCase());
  });

  it('should return filtered clinics properly', () => {
    const values = '3';
    const clinics = [
      {
        name: 'name 1',
        address: 'address 1',
        area: 'area 1',
        district: 'district 1',
      },
      {
        name: 'name 2',
        address: 'address 2',
        area: 'area 2',
        district: 'district 2',
      },
      {
        name: 'name 3',
        address: 'address 3',
        area: 'area 3',
        district: 'district 3',
      },
      {
        name: 'name 4',
        address: 'address 4',
        area: 'area 4',
        district: 'district 4',
      },
      {
        name: 'name 43',
        address: 'address 43',
        area: 'area 43',
        district: 'district 43',
      },
    ];
    const expectedResults = [
      {
        name: 'name 3',
        address: 'address 3',
        area: 'area 3',
        district: 'district 3',
      },
      {
        name: 'name 43',
        address: 'address 43',
        area: 'area 43',
        district: 'district 43',
      },
    ];
    const instance = new SearchAllFilter(values);
    expect(instance.filter(clinics)).toEqual(expectedResults);
  });
});
