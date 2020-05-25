import SearchByNameFilter from '../SearchByNameFilter';

describe('SearchByNameFilter', () => {
  it('should filter clinics by clinic name case-insensitive', () => {
    const searchTerm = 'otherDoc';
    const searchByNameFilter = new SearchByNameFilter([searchTerm]);
    const clinics = [
      {
        name: 'Dr OtherDoc',
      },
      {
        name: 'Dr WhoDat',
      },
    ];

    const filteredClinics = searchByNameFilter.filter(clinics);

    expect(filteredClinics).toEqual([
      {
        name: 'Dr OtherDoc',
      },
    ]);
  });

  it('should return empty array if there is no matching clinic name', () => {
    const searchTerm = 'test';
    const searchByNameFilter = new SearchByNameFilter([searchTerm]);
    const clinics = [
      {
        name: 'Dr OtherDoc',
      },
      {
        name: 'Dr WhoDat',
      },
    ];

    const filteredClinics = searchByNameFilter.filter(clinics);

    expect(filteredClinics).toEqual([]);
  });
});
