export default class DistrictFilter {
  constructor([area, district]) {
    this.area = area;
    this.district = district;
  }
  filter(clinics) {
    return clinics.filter(
      clinic => clinic.area === this.area && clinic.district === this.district,
    );
  }
}
