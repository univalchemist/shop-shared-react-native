import {
  MatchValueFilter,
  FilterTypes,
  PanelClinicFilters,
  panelFilterFactory,
  SearchAllFilter,
} from '../';

describe('PanelClinicFilters', () => {
  const createPanelClinicFilters = () => {
    return new PanelClinicFilters({});
  };
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  it('should have no filter initially', () => {
    const panelClinicFilters = createPanelClinicFilters();

    expect(panelClinicFilters.getAllFilters().length).toEqual(0);
  });

  describe('update', () => {
    it('should add filter when filter does not exist', () => {
      const panelClinicFilters = createPanelClinicFilters();

      const updatedFilter = {
        type: FilterTypes.AREA,
        values: ['Hong Kong'],
      };
      panelClinicFilters.update(updatedFilter);

      expect(panelClinicFilters.getAllFilters()).toContainEqual(
        new MatchValueFilter(updatedFilter),
      );
    });

    it('should update filter values when filter exists', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.AREA,
        values: ['Hong Kong'],
      };
      const updatedFilter = {
        type: FilterTypes.AREA,
        values: ['Kowloon'],
      };

      panelClinicFilters.update(initialFilter);
      panelClinicFilters.update(updatedFilter);

      expect(panelClinicFilters.getAllFilters()).toContainEqual(
        new MatchValueFilter(updatedFilter),
      );
    });

    it('should reset filter values when do search', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.AREA,
        values: ['Hong Kong'],
      };
      const updatedFilter = {
        type: FilterTypes.AREA,
        values: ['Kowloon'],
      };
      const doSearch = {
        type: FilterTypes.SEARCH_ALL,
        values: ['Central'],
      };

      panelClinicFilters.update(initialFilter);
      panelClinicFilters.update(updatedFilter);
      panelClinicFilters.update(doSearch);

      expect(panelClinicFilters.getAllFilters().length).toEqual(1);
      expect(panelClinicFilters.getAllFilters()[0].searchTerm).toEqual(
        'CENTRAL',
      );
    });

    it('should remove filter when there is no filter value', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['SPECIALIST', 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY'],
      };
      const updatedFilter = {
        type: FilterTypes.SPECIALTY,
        values: [],
      };

      panelClinicFilters.update(initialFilter);
      panelClinicFilters.update(updatedFilter);

      expect(panelClinicFilters.getAllFilters()).not.toContainEqual(
        expect.objectContaining({ type: FilterTypes.SPECIALTY }),
      );
    });

    const mutuallyExclusiveFilterGroup = [
      FilterTypes.NEAR_ME,
      FilterTypes.AREA,
      FilterTypes.DISTRICT,
      FilterTypes.NAME,
      FilterTypes.SEARCH_ALL,
    ];
    describe(`In mutually exclusive group of [${mutuallyExclusiveFilterGroup.join(
      ', ',
    )}]`, () => {
      const panelClinicFilters = createPanelClinicFilters();

      const filters = mutuallyExclusiveFilterGroup;

      filters.forEach(currentFilter =>
        it(`should only contain filter ${currentFilter} when filter ${currentFilter} is added`, () => {
          panelClinicFilters.update({
            type: currentFilter,
            values: ['value 1', 'value 2'],
          });

          expect(panelClinicFilters.getAllFilters().length).toBe(1);
          expect(panelClinicFilters.getAllFilters()).toEqual([
            panelClinicFilters.getFilterByType(currentFilter),
          ]);
        }),
      );
    });

    describe(`In mutually exclusive group of [${mutuallyExclusiveFilterGroup.join(
      ', ',
    )}]`, () => {
      const panelClinicFilters = createPanelClinicFilters();

      panelClinicFilters.update({
        type: FilterTypes.SPECIALTY,
        values: ['Specialist'],
      });

      const filters = mutuallyExclusiveFilterGroup;

      filters.forEach(currentFilter =>
        it(`should not remove filters that are not in mutually exclusive group when filter ${currentFilter} is added`, () => {
          panelClinicFilters.update({
            type: currentFilter,
            values: ['value 1', 'value 2'],
          });

          expect(panelClinicFilters.getAllFilters().length).toBe(2);
          expect(panelClinicFilters.getAllFilters()).toEqual([
            panelClinicFilters.getFilterByType(FilterTypes.SPECIALTY),
            panelClinicFilters.getFilterByType(currentFilter),
          ]);
        }),
      );
    });

    it('should call filter factory', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const filterArgs = {
        type: 'someFilterType',
        values: ['value1', 'value2'],
      };

      jest.spyOn(panelFilterFactory, 'create');

      panelClinicFilters.update(filterArgs);

      expect(panelFilterFactory.create).toHaveBeenCalledTimes(1);
      expect(panelFilterFactory.create).toHaveBeenCalledWith(filterArgs);
    });

    it('should add filter returned by filter factory', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const filterArgs = {
        type: 'someFilterType',
        values: ['value1', 'value2'],
      };
      const filter = {
        ...filterArgs,
        filter: () => {},
      };
      jest.spyOn(panelFilterFactory, 'create').mockReturnValueOnce(filter);

      panelClinicFilters.update(filterArgs);

      expect(panelClinicFilters.getAllFilters()).toEqual([filter]);
    });

    it('should not add any filter when filter factory return undefined', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const filterArgs = {
        type: 'someFilterType',
        values: ['value1', 'value2'],
      };
      jest.spyOn(panelFilterFactory, 'create').mockReturnValueOnce(undefined);

      panelClinicFilters.update(filterArgs);

      expect(panelClinicFilters.getAllFilters()).toEqual([]);
    });

    it('should remove all filters if filter to be added is ALL_CLINICS', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['SPECIALIST', 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY'],
      };

      panelClinicFilters.update(initialFilter);

      const filterArgs = {
        type: FilterTypes.ALL_CLINICS,
        values: ['all clinics'],
      };

      const filter = {
        ...filterArgs,
        filter: () => {},
      };
      jest.spyOn(panelFilterFactory, 'create').mockReturnValueOnce(filter);

      panelClinicFilters.update(filterArgs);

      expect(panelClinicFilters.getAllFilters()).toEqual([filter]);
    });
  });

  describe('getFilterByType', () => {
    it('should return empty object given a non existing filter type', () => {
      const panelClinicFilters = createPanelClinicFilters();

      expect(panelClinicFilters.getFilterByType(FilterTypes.AREA)).toEqual({});
    });

    it('should return the filter given an existing filter type', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['SPECIALIST'],
      };

      panelClinicFilters.update(initialFilter);

      expect(panelClinicFilters.getFilterByType(FilterTypes.SPECIALTY)).toEqual(
        new MatchValueFilter(initialFilter),
      );
    });
  });

  describe('apply', () => {
    it('should filter clinics by filter types', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const firstFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['SPECIALIST'],
      };
      const secondFilter = {
        type: FilterTypes.AREA,
        values: ['Hong Kong'],
      };
      const clinicData1 = {
        name: 'Clinic 1',
        area: 'Hong Kong',
        specialty: 'SPECIALIST',
      };
      const clinicData2 = {
        name: 'Clinic 2',
        area: 'Hong Kong',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };

      const clinicData3 = {
        name: 'Clinic 3',
        area: 'Macau',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };
      const clinics = [clinicData1, clinicData2, clinicData3];

      panelClinicFilters.update(firstFilter);
      panelClinicFilters.update(secondFilter);

      expect(panelClinicFilters.apply(clinics)).toEqual([clinicData1]);
    });

    it('should return empty array when there is no qualified clinics', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const firstFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['SPECIALIST'],
      };
      const secondFilter = {
        type: FilterTypes.AREA,
        values: ['Macau'],
      };
      const clinicData1 = {
        name: 'Clinic 1',
        area: 'Hong Kong',
        specialty: 'SPECIALIST',
      };
      const clinicData2 = {
        name: 'Clinic 2',
        area: 'Hong Kong',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };

      const clinicData3 = {
        name: 'Clinic 3',
        area: 'Macau',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };
      const clinics = [clinicData1, clinicData2, clinicData3];

      panelClinicFilters.update(firstFilter);
      panelClinicFilters.update(secondFilter);

      expect(panelClinicFilters.apply(clinics)).toEqual([]);
    });

    it('should return as is when there is no filter', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const clinicData1 = {
        name: 'Clinic 1',
        area: 'Hong Kong',
        specialty: 'SPECIALIST',
      };
      const clinicData2 = {
        name: 'Clinic 2',
        area: 'Hong Kong',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };

      const clinicData3 = {
        name: 'Clinic 3',
        area: 'Macau',
        specialty: 'OCCUPATIONAL_THERAPY_PHYSIOTHERAPY',
      };
      const clinics = [clinicData1, clinicData2, clinicData3];

      expect(panelClinicFilters.apply(clinics)).toEqual(clinics);
    });
  });

  describe('removeAll', () => {
    it('should remove all filters', () => {
      const panelClinicFilters = createPanelClinicFilters();
      const areaFilter = {
        type: FilterTypes.AREA,
        values: ['Kowloon'],
      };
      const specialtyFilter = {
        type: FilterTypes.SPECIALTY,
        values: ['Hospitals'],
      };
      panelClinicFilters.update(areaFilter);
      panelClinicFilters.update(specialtyFilter);

      panelClinicFilters.removeAll();

      expect(panelClinicFilters.getAllFilters().length).toBe(0);
    });
  });

  describe('hasFilter', () => {
    let panelClinicFilters;
    beforeEach(() => {
      panelClinicFilters = createPanelClinicFilters();
      const initialFilter = {
        type: FilterTypes.AREA,
        values: ['Area 1'],
      };

      panelClinicFilters.update(initialFilter);
    });
    it('should return true when there exist filter with given type', () => {
      expect(panelClinicFilters.hasFilter(FilterTypes.AREA)).toBe(true);
    });

    it('should return false when there exist no filter with given type', () => {
      expect(panelClinicFilters.hasFilter(FilterTypes.SPECIALTY)).toBe(false);
    });
  });
});
