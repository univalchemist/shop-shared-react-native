export default class SearchByNameFilter {
  constructor([value]) {
    this.searchTerm = value.trim().toUpperCase();
  }

  filter(clinics) {
    return clinics.filter(clinic =>
      clinic.name.toUpperCase().includes(this.searchTerm),
    );
  }
}
