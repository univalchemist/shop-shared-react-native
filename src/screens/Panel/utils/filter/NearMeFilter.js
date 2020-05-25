import { getDistance } from 'geolib';

const RADIUS_IN_METERS = 1500;
export default class NearMeFilter {
  constructor([longitude, latitude]) {
    this.currentLocation = { latitude, longitude };
  }
  filter(clinics) {
    return clinics.filter(
      clinic => getDistance(clinic, this.currentLocation) <= RADIUS_IN_METERS,
    );
  }
}
