export default class MatchValueFilter {
  constructor({ type, values }) {
    this.type = type;
    this.values = values || [];
  }

  filter(clinics) {
    return clinics.filter(clinic => this.values.includes(clinic[this.type]));
  }
}
