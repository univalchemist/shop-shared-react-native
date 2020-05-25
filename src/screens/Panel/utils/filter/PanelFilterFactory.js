import MatchValueFilter from './MatchValueFilter';
import * as FilterTypes from './FilterTypes';
import NearMeFilter from './NearMeFilter';
import SearchByNameFilter from './SearchByNameFilter';
import ShowAllClinicsFilter from './ShowAllClinicsFilter';
import DistrictFilter from './DistrictFilter';
import SearchAllFilter from './SearchAllFilter';

export class PanelFilterFactory {
  constructor() {
    this.supportedFilterTypes = new Map([
      [[FilterTypes.NEAR_ME], ({ values }) => new NearMeFilter(values)],
      [
        [FilterTypes.ALL_CLINICS],
        ({ values }) => new ShowAllClinicsFilter(values),
      ],
      [[FilterTypes.DISTRICT], ({ values }) => new DistrictFilter(values)],
      [[FilterTypes.NAME], ({ values }) => new SearchByNameFilter(values)],
      [[FilterTypes.SEARCH_ALL], ({ values }) => new SearchAllFilter(values)],
      [
        Object.keys(FilterTypes).map(key => FilterTypes[key]),
        ({ type, values }) => new MatchValueFilter({ type, values }),
      ],
    ]);
  }
  create({ type, values }) {
    for (let [types, createFilter] of this.supportedFilterTypes) {
      if (types.includes(type)) {
        return createFilter({ type, values });
      }
    }
    return undefined;
  }
}

export default new PanelFilterFactory();
