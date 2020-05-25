import reducer from '../reducer';
import * as types from '../types';
import { FilterTypes, PanelClinicFilters } from '@screens/Panel/utils/filter';

describe('Panel reducer', () => {
  const createPanelClinicFilters = () => new PanelClinicFilters({});

  describe('initial state', () => {
    it('should have panel filters initialized', () => {
      const initialState = reducer(undefined, {});

      expect(initialState.filters).toEqual(expect.any(PanelClinicFilters));
    });

    it('should have specialty as an empty array', () => {
      const initialState = reducer(undefined, {});

      expect(initialState.specialty).toEqual([]);
    });

    it('should have selectedClinics as an empty array', () => {
      const initialState = reducer(undefined, {});

      expect(initialState.selectedClinics).toEqual([]);
    });

    it('should return the initialState', () => {
      const expectedState = {
        defaultLocation: {
          latitude: 22.266021,
          longitude: 114.186422,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        },
        clinics: [],
        filteredClinics: [],
        selectedClinic: undefined,
      };

      const initialState = reducer(undefined, {});

      expect(Object.keys(initialState)).toEqual(
        expect.arrayContaining(Object.keys(expectedState)),
      );
      expect(reducer(undefined, {})).toEqual(
        expect.objectContaining(expectedState),
      );
    });
  });

  describe('FETCH_PANEL_CLINICS_SUCCESS', () => {
    let initialState, clinic1, clinic2, clinic3, clinicData, action, newState;

    beforeEach(() => {
      initialState = {
        defaultLocation: {
          latitude: 22.266021,
          longitude: 114.186422,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        },
        filteredClinics: [],
        selectedClinic: undefined,
        selectedClinics: [],
        clinics: [],
      };

      clinic1 = {
        name: 'Clinic 1',
        specialty: 'General Practitioner',
        longitude: 34.22,
        latitude: -8.1,
      };

      clinic2 = {
        name: 'Clinic 2',
        specialty: 'General Practitioner',
        longitude: -146.18,
        latitude: 10.45,
      };

      clinic3 = {
        name: 'Clinic 3',
        specialty: 'General surgery',
        longitude: 36.15,
        latitude: 6.11,
      };

      clinicData = [clinic1, clinic2, clinic3];

      action = {
        type: types.FETCH_PANEL_CLINICS_SUCCESS,
        payload: clinicData,
      };

      newState = reducer(initialState, action);
    });

    it(`should save clinic data to state as clinics`, () => {
      expect(newState.clinics).toEqual(clinicData);
    });

    it('should use the same data for clinics state for filteredClinics', () => {
      expect(newState.filteredClinics).toEqual(newState.clinics);
    });

    it(`should use the first clinic as selectedClinic`, () => {
      expect(newState.selectedClinic).toEqual(clinicData[0]);
    });

    it('should save unique consultation types extracted from recevied clinics', () => {
      expect(newState.specialty).toEqual([
        'General Practitioner',
        'General surgery',
      ]);
    });

    it('should set selectedClinics to empty array', () => {
      expect(newState.selectedClinics).toEqual([]);
    });
  });

  describe('UPDATE_SELECTED_CLINIC', () => {
    it('should update selectedClinic', () => {
      const clinicData = {
        address: 'xyz',
        latitude: '1.22',
        longitude: '2.22',
        name: 'Clinic 1',
        specialty: 'General Practitioner',
      };
      const initialState = {
        defaultLocation: {},
        clinics: [
          { id: 1, ...clinicData },
          { id: 2, ...clinicData },
        ],
        selectedClinic: { id: 1, ...clinicData },
      };

      const expectedState = {
        ...initialState,
        selectedClinic: { id: 2, ...clinicData },
      };

      const action = {
        type: types.UPDATE_SELECTED_CLINIC,
        payload: { id: 2, ...clinicData },
      };
      expect(reducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('UPDATE_FILTERS', () => {
    let filters,
      currentState,
      clinics,
      clinicData1,
      clinicData2,
      action,
      filteredClinics;
    beforeEach(() => {
      filters = createPanelClinicFilters();
      jest.spyOn(filters, 'update');
      clinicData1 = {
        name: 'Clinic 1',
        specialty: 'General surgery',
      };
      clinicData2 = {
        name: 'Clinic 2',
        specialty: 'Hospital',
      };

      action = {
        type: types.UPDATE_FILTERS,
        payload: {
          type: FilterTypes.SPECIALTY,
          values: ['General surgery'],
        },
      };

      clinics = [clinicData1, clinicData2];
      filteredClinics = [clinicData1];
      jest.spyOn(filters, 'apply').mockReturnValue(filteredClinics);

      const initialState = {
        filters,
        clinics,
        selectedClinics: [clinics[1]],
      };

      currentState = reducer(initialState, action);
    });
    it('should update panel filters', () => {
      expect(filters.update).toHaveBeenCalledWith({
        type: FilterTypes.SPECIALTY,
        values: ['General surgery'],
      });
    });

    it('should apply clinic filters and save the result in filteredClinics state', () => {
      expect(filters.apply).toHaveBeenCalledWith(clinics);
      expect(currentState.filteredClinics).toEqual(filteredClinics);
    });

    it(`should set selectedClinic to be the first filtered clinic`, () => {
      expect(currentState.selectedClinic).toEqual(filteredClinics[0]);
    });

    it('should set selectedClinic to undefined when there is no filteredClinics', () => {
      jest.spyOn(filters, 'apply').mockReturnValue([]);
      const current = reducer({ filters }, action);

      expect(current.selectedClinic).toEqual(undefined);
    });

    it('should set selectedClinics to empty array', () => {
      expect(currentState.selectedClinics).toEqual([]);
    });
  });

  describe('CLEAR_PANEL_CLINICS', () => {
    let currentState, filters;
    beforeEach(() => {
      filters = createPanelClinicFilters();
      jest.spyOn(filters, 'removeAll');

      const clinicData1 = {
        name: 'Clinic 1',
      };
      const clinicData2 = {
        name: 'Clinic 2',
      };

      const action = {
        type: types.CLEAR_PANEL_CLINICS,
        payload: [],
      };

      const clinics = [clinicData1, clinicData2];
      const initialState = {
        filters,
        clinics,
        selectedClinics: [clinics[0]],
      };

      currentState = reducer(initialState, action);
    });
    it('should clear all filtered clinics', () => {
      expect(currentState.filteredClinics).toEqual([]);
    });

    it('should remove all filters', () => {
      expect(filters.removeAll).toHaveBeenCalled();
    });

    it('should set selectedClinics to empty array', () => {
      expect(currentState.selectedClinics).toEqual([]);
    });
  });

  describe('REMOVE_ALL_FILTERS', () => {
    let currentState;
    let filters;
    const clinic1 = { name: 'Clinic 1' };
    const clinic2 = { name: 'Clinic 2' };

    let allClinics;
    beforeEach(() => {
      filters = createPanelClinicFilters();
      jest.spyOn(filters, 'removeAll');
      allClinics = [clinic1, clinic2];
      const initialState = {
        filters,
        clinics: allClinics,
        filteredClinics: [clinic2],
        selectedClinic: clinic2,
        selectedClinics: [clinic1],
      };
      const action = {
        type: types.REMOVE_ALL_FILTERS,
      };

      currentState = reducer(initialState, action);
    });
    it('should remove all panel filters', () => {
      expect(filters.removeAll).toHaveBeenCalled();
    });

    it('should update filtered clinics to all clinics', () => {
      expect(currentState.filteredClinics).toEqual(allClinics);
    });

    it('should set selected clinics to the first clinic', () => {
      expect(currentState.selectedClinic).toEqual(allClinics[0]);
    });

    it('should set selectedClinics to empty array', () => {
      expect(currentState.selectedClinics).toEqual([]);
    });
  });

  describe('UPDATE_SELECTED_CLINICS', () => {
    const initialState = {
      selectedClinics: [],
    };
    const clinics = [
      {
        name: 'Clinic1',
      },
      {
        name: 'Clinic2',
      },
    ];

    const action = {
      type: types.UPDATE_SELECTED_CLINICS,
      payload: clinics,
    };

    const expectedState = reducer(initialState, action);

    it('should update selected clinics', () => {
      expect(expectedState.selectedClinics).toEqual(clinics);
    });
  });
});
