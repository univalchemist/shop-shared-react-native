import NearMeFilter from '../NearMeFilter';

describe('NearMeFilter', () => {
  const currentLocation = {
    latitude: 1.23,
    longitude: 2.23,
  };

  it('should filter for clinics that is within 1.55km radius', () => {
    const nearMeFilter = new NearMeFilter([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);
    const clinics = [
      {
        latitude: 1.55,
        longitude: 2.88,
        name: 'Dr OtherDoc',
      },
      {
        latitude: 1.22,
        longitude: 2.225,
        name: 'Dr WhoDat',
      },
    ];

    const actual = nearMeFilter.filter(clinics);

    expect(actual).toEqual([clinics[1]]);
  });

  it('should return empty array when there is no clinics near me', () => {
    const nearMeFilter = new NearMeFilter([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);

    const clinics = [
      {
        latitude: 1.22,
        longitude: 1.34,
        name: 'Dr efg',
      },
      {
        latitude: 1.22,
        longitude: 1.34,
        name: 'Dr xyz',
      },
      {
        latitude: 1.22,
        longitude: 1.34,
        id: 11,
        name: 'Dr abc',
      },
    ];

    const actual = nearMeFilter.filter(clinics);

    expect(actual).toEqual([]);
  });
});
