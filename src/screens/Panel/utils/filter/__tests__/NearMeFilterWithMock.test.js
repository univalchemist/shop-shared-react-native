import NearMeFilter from '../NearMeFilter';
import * as Geolib from 'geolib';

jest.mock('geolib', () => ({ getDistance: jest.fn() }));

describe('NearMeFilterWithMock', () => {
  const currentLocation = {
    latitude: 1.23,
    longitude: 2.23,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use initialized currentLocation to compute distance', () => {
    const nearMeFilter = new NearMeFilter([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);
    const clinics = [
      { longitude: 1.44, latitude: 4.11 },
      { longitude: 0.2, latitude: 12.4 },
    ];
    nearMeFilter.filter(clinics);

    clinics.forEach((clinic, index) =>
      expect(Geolib.getDistance).toHaveBeenNthCalledWith(
        index + 1,
        clinic,
        currentLocation,
      ),
    );
  });

  it('should use the first value as longitude and second value as latitude', () => {
    const nearMeFilter = new NearMeFilter([1, 2]);
    const clinics = [
      { longitude: 1.44, latitude: 4.11 },
      { longitude: 0.2, latitude: 12.4 },
    ];
    nearMeFilter.filter(clinics);

    clinics.forEach((clinic, index) =>
      expect(Geolib.getDistance).toHaveBeenNthCalledWith(index + 1, clinic, {
        longitude: 1,
        latitude: 2,
      }),
    );
  });
});
