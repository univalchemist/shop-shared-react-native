export default class SearchAllFilter {
  constructor([value]) {
    this.searchTerm = value.trim().toUpperCase();
  }

  filter(clinics) {
    return clinics.filter(
      clinic =>
        clinic.name.toUpperCase().includes(this.searchTerm) ||
        clinic.address.toUpperCase().includes(this.searchTerm) ||
        clinic.area.toUpperCase().includes(this.searchTerm) ||
        clinic.district.toUpperCase().includes(this.searchTerm),
    );
  }
}
