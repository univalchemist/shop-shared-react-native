import { computeDestinationPoint } from 'geolib';

const computeKey = ({ longitude, latitude }) => {
  return longitude + latitude;
};

const add = (map, key, value) => {
  if (!map.has(key)) {
    map.set(key, []);
  }
  map.get(key).push(value);
};

const groupClinicsByLocation = clinics => {
  const groupsByLocation = new Map();

  clinics.map(clinic => {
    const key = computeKey({
      longitude: clinic.longitude,
      latitude: clinic.latitude,
    });
    add(groupsByLocation, key, clinic);
  });

  return groupsByLocation;
};

const RADIUS_FROM_ORIGINAL = 1;

const distributeAroundOriginalLocation = clinics => {
  const bearingIncrement = Math.floor(360 / clinics.length);
  return clinics.map((clinic, index) => {
    const displayCoords = computeDestinationPoint(
      { longitude: clinic.longitude, latitude: clinic.latitude },
      RADIUS_FROM_ORIGINAL,
      bearingIncrement * index,
    );
    return {
      ...clinic,
      displayLatitude: displayCoords.latitude,
      displayLongitude: displayCoords.longitude,
    };
  });
};

const getCoordinatesForDisplay = clinics =>
  clinics.map(clinic => ({
    ...clinic,
    displayLatitude: clinic.latitude,
    displayLongitude: clinic.longitude,
  }));

const computeDisplayCoordinates = map => {
  const processedClinics = [];

  for (let aClinicGroup of map.values()) {
    let clinicsWithDisplayCoords;
    if (aClinicGroup.length === 1) {
      clinicsWithDisplayCoords = getCoordinatesForDisplay(aClinicGroup);
    } else {
      clinicsWithDisplayCoords = distributeAroundOriginalLocation(aClinicGroup);
    }
    processedClinics.push.apply(processedClinics, clinicsWithDisplayCoords);
  }
  return processedClinics;
};

export const processClinicData = clinics => {
  const clinicGroups = groupClinicsByLocation(clinics);

  return computeDisplayCoordinates(clinicGroups);
};
