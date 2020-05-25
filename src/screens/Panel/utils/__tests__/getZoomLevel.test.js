import { getZoomLevel } from '../getZoomLevel';
import ClusteredMap from 'react-native-maps-super-cluster';
import geoViewport from '@mapbox/geo-viewport';

jest.mock('react-native-maps-super-cluster', () => ({
  ...jest.requireActual('react-native-maps-super-cluster'),
  regionToBoundingBox: jest.fn(),
}));

jest.mock('@mapbox/geo-viewport', () => ({
  ...jest.requireActual('@mapbox/geo-viewport'),
  viewport: jest.fn(),
}));

describe('getZoomLevel', () => {
  const dimension = {
    width: 480,
    height: 640,
  };

  const region = {
    latitude: 57.32,
    longitude: 104.2,
    latitudeDelta: 1.24,
    longitudeDelta: 14.5,
  };

  const bbox = [
    5.668343999999995,
    45.111511000000014,
    5.852471999999996,
    45.26800200000002,
  ];

  const someViewport = {
    center: [5.7604079999999955, 45.189756500000016],
    zoom: 11,
  };

  beforeEach(() => {
    ClusteredMap.regionToBoundingBox.mockClear();
    geoViewport.viewport.mockClear();
    ClusteredMap.regionToBoundingBox.mockReturnValueOnce(bbox);
    geoViewport.viewport.mockReturnValueOnce(someViewport);
  });

  describe('validate input', () => {
    it.each(['latitude', 'longitude', 'latitudeDelta', 'longitudeDelta'])(
      'should throw error when received region is missing %s field',
      missingField => {
        const invalidRegion = { ...region };
        delete invalidRegion[missingField];

        expect(() => getZoomLevel(invalidRegion, dimension)).toThrowError(
          new Error(`Region object is missing ${missingField} field.`),
        );
      },
    );
  });

  it('should convert region to bounding box', () => {
    getZoomLevel(region, dimension);

    expect(ClusteredMap.regionToBoundingBox).toHaveBeenCalledTimes(1);
    expect(ClusteredMap.regionToBoundingBox).toHaveBeenCalledWith(region);
  });

  it('should convert bbox to viewport', () => {
    ClusteredMap.regionToBoundingBox.mockReturnValueOnce(bbox);

    getZoomLevel(region, dimension);

    expect(geoViewport.viewport).toHaveBeenCalledTimes(1);
    expect(geoViewport.viewport).toHaveBeenCalledWith(bbox, [
      dimension.width,
      dimension.height,
    ]);
  });

  it('should return zoom of viewport', () => {
    const zoom = getZoomLevel(region, dimension);

    expect(zoom).toEqual(someViewport.zoom);
  });
});
