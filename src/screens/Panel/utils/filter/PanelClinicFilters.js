import * as FilterTypes from './FilterTypes';
import panelFilterFactory from './PanelFilterFactory';
export default class PanelClinicFilters {
  constructor({ filterFactory = panelFilterFactory }) {
    this.filters = new Map();

    this.filterFactory = filterFactory;

    this.mutuallyExclusiveFilterGroups = [
      new Set([
        FilterTypes.NEAR_ME,
        FilterTypes.AREA,
        FilterTypes.DISTRICT,
        FilterTypes.NAME,
        FilterTypes.SEARCH_ALL,
      ]),
    ];
  }

  getAllFilters() {
    return this.filters.size === 0 ? [] : Array.from(this.filters.values());
  }

  getFilterByType(type) {
    return this.hasFilter(type) ? this.filters.get(type) : {};
  }

  hasFilter(type) {
    return this.filters.has(type);
  }

  deleteFilter(type) {
    return this.filters.delete(type);
  }

  addFilter(type, filter) {
    this.filters.set(type, filter);
  }

  update({ type, values }) {
    if (values.length === 0) {
      this.deleteFilter(type);
      return;
    }

    if (type === FilterTypes.ALL_CLINICS) {
      this.removeAll();
    }

    let filterGroup = this.mutuallyExclusiveFilterGroups.find(group =>
      group.has(type),
    );

    if (filterGroup) {
      filterGroup.forEach(value => this.deleteFilter(value));
    }

    const filter = this.filterFactory.create({ type, values });
    if (filter) {
      this.addFilter(type, filter);
    }
  }

  removeAll() {
    this.filters.clear();
  }

  apply(clinics) {
    return this.getAllFilters().reduce((filteredClinics, currentFilter) => {
      return currentFilter.filter(filteredClinics);
    }, clinics);
  }
}
