import { regionToBoundingBox } from 'react-native-maps-super-cluster';
import { viewport } from '@mapbox/geo-viewport';

export const getZoomLevel = (region, { width, height }) => {
  validate(region);
  const bbox = regionToBoundingBox(region);
  const currentViewPort = viewport(bbox, [width, height]);
  return currentViewPort.zoom;
};

const validate = region => {
  const requiredFields = [
    'latitude',
    'longitude',
    'latitudeDelta',
    'longitudeDelta',
  ];
  let missingField;
  if (
    (missingField = requiredFields.find(
      requiredField => region[requiredField] == undefined,
    ))
  ) {
    throw new Error(`Region object is missing ${missingField} field.`);
  }
};
