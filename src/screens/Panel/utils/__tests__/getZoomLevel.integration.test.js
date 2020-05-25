import { getZoomLevel } from '../getZoomLevel';

describe('getZoomLevel using actual dependencies', () => {
  it('should return a number for zoom level', () => {
    const region = {
      latitude: 57.32,
      longitude: 104.2,
      latitudeDelta: 1.24,
      longitudeDelta: 14.5,
    };
    const dimension = {
      width: 480,
      height: 640,
    };

    const result = getZoomLevel(region, dimension);

    expect(result).toBeGreaterThanOrEqual(0);
  });
});
