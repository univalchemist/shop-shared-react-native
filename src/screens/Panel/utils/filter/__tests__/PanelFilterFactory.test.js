import panelFilterFactory from '../PanelFilterFactory';
import * as FilterTypes from '../FilterTypes';
import MatchValueFilter from '../MatchValueFilter';
import NearMeFilter from '../NearMeFilter';
import SearchByNameFilter from '../SearchByNameFilter';
import ShowAllClinicsFilter from '../ShowAllClinicsFilter';
import DistrictFilter from '../DistrictFilter';

describe('PanelFilterFactory', () => {
  describe('create', () => {
    it('should return NearMeFilter when type is nearme', () => {
      const longitude = 3.11;
      const latitude = 1.44;
      const filter = {
        type: FilterTypes.NEAR_ME,
        values: [longitude, latitude],
      };

      const actual = panelFilterFactory.create(filter);

      expect(actual).toEqual(new NearMeFilter([longitude, latitude]));
    });

    it('should return SearchByNameFilter when type is name', () => {
      const name = 'Dr Wu';
      const filter = {
        type: FilterTypes.NAME,
        values: [name],
      };

      const actual = panelFilterFactory.create(filter);

      expect(actual).toEqual(new SearchByNameFilter([name]));
    });

    it('should return ShowAllClinicsFilter when type is all clinics', () => {
      const name = 'Dr Wu';
      const filter = {
        type: FilterTypes.ALL_CLINICS,
        values: [name],
      };

      const actual = panelFilterFactory.create(filter);

      expect(actual).toEqual(new ShowAllClinicsFilter([name]));
    });

    it('should return DistrictFilter when type is district', () => {
      const name = 'Dr Wu';
      const filter = {
        type: FilterTypes.DISTRICT,
        values: [name],
      };

      const actual = panelFilterFactory.create(filter);

      expect(actual).toEqual(new DistrictFilter([name]));
    });

    test.each([[FilterTypes.AREA], [FilterTypes.SPECIALTY]])(
      'should return MatchValueFilter when type is %s',
      filterType => {
        const filter = {
          type: filterType,
          values: ['value1', 'value2'],
        };

        const actual = panelFilterFactory.create(filter);

        expect(actual).toEqual(new MatchValueFilter(filter));
      },
    );

    it('should return undefined when filter type is not supported', () => {
      const filter = {
        type: 'someFilterType',
        values: ['value1', 'value2'],
      };

      const actual = panelFilterFactory.create(filter);

      expect(actual).toEqual(undefined);
    });
  });
});
