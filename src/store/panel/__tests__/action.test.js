import { configureMockStore } from '@testUtils';
import * as actions from '../actions';
import * as types from '../types';
import * as PanelUtils from '../processClinicData';
import { FilterTypes } from '@screens/Panel/utils/filter';

const clinicsData = [
  {
    name: 'Dr Acc',
    address: 'xyz',
    latitude: '1.22',
    longitude: '2.22',
  },
  {
    name: 'Dr Abc',
    address: 'xyz',
    latitude: '1.22',
    longitude: '2.22',
  },
];

const clinicHasNameWithLeadingSpaces = {
  name: '   Professor X',
  address: 'Sixth Avenue',
  latitude: '56.3',
  longitude: '-20.1',
  id: 1,
};
const clinicsHasNameWithTrailingSpaces = {
  name: 'Dr Strange   ',
  address: 'Long Beach Road',
  latitude: '-4.01',
  longitude: '10.7',
  id: 2,
};
const clinicWithNullSpecialty = {
  name: 'Dr Strange   ',
  address: 'Long Beach Road',
  latitude: '-4.01',
  longitude: '10.7',
  specialty: null,
  consultationType: 'GP',
  id: 3,
};
const clinicWithNullConsultationType = {
  name: 'Dr Strange   ',
  address: 'Long Beach Road',
  latitude: '-4.01',
  longitude: '10.7',
  specialty: 'Hospital',
  consultationType: null,
  id: 3,
};
const clinicsWhoseNameHasSpaces = [
  clinicHasNameWithLeadingSpaces,
  clinicsHasNameWithTrailingSpaces,
];
const clinicsWithSpecialty = [
  clinicWithNullSpecialty,
  clinicWithNullConsultationType,
];

const api = {
  fetchPanelClinics: jest.fn(() => ({
    data: clinicsData,
  })),
};

const clinics = store =>
  store
    .getActions()
    .find(action => action.type === types.FETCH_PANEL_CLINICS_SUCCESS).payload;

const getProperty = (items, propertyName) =>
  items.map(item => item[propertyName]);

describe('Panel actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPanelClinics', () => {
    let mockApi, receivedClinicData;
    beforeAll(() => {
      receivedClinicData = [...clinicsWhoseNameHasSpaces];
      mockApi = {
        fetchPanelClinics: jest.fn(() => ({
          data: receivedClinicData,
        })),
      };
    });

    let store, initialState;
    beforeEach(async () => {
      initialState = {
        user: {
          clientId: 'clientid',
          userId: 'userid',
        },
      };

      jest.spyOn(PanelUtils, 'processClinicData');

      store = configureMockStore(mockApi)(initialState);

      await store.dispatch(actions.fetchPanelClinics());
    });

    it('should create an action to fetch panel data', () => {
      expect(store.getActions().map(action => action.type)).toEqual([
        types.FETCH_PANEL_CLINICS_START,
        types.FETCH_PANEL_CLINICS_SUCCESS,
      ]);
    });

    it('should call api to fetch clinic data', () => {
      expect(mockApi.fetchPanelClinics).toHaveBeenCalled();
      expect(mockApi.fetchPanelClinics).toHaveBeenCalledWith(
        initialState.user.clientId,
        initialState.user.userId,
      );
    });

    it('should trim trailing and leading spaces from clinic name', () => {
      const clinicNamesInState = getProperty(clinics(store), 'name');
      const expectedClinicNames = ['Professor X', 'Dr Strange'];

      expect(clinicNamesInState.length).toEqual(expectedClinicNames.length);
      expect(clinicNamesInState).toEqual(
        expect.arrayContaining(expectedClinicNames),
      );
    });

    it('should not process clinic data', () => {
      expect(PanelUtils.processClinicData).not.toHaveBeenCalled();
    });

    it('should not populate display coordinates', async () => {
      const allAreUndefined = Array(clinics(store).length).fill(undefined);
      expect(getProperty(clinics(store), 'displayLatitude')).toEqual(
        allAreUndefined,
      );
      expect(getProperty(clinics(store), 'displayLongitude')).toEqual(
        allAreUndefined,
      );
    });

    it('should generate location field for each clinic', () => {
      expect(getProperty(clinics(store), 'location')).not.toContain(undefined);
    });
  });

  describe('specialty/consultationType', () => {
    let mockApi, receivedClinicData;
    beforeAll(() => {
      receivedClinicData = [...clinicsWithSpecialty];
      mockApi = {
        fetchPanelClinics: jest.fn(() => ({
          data: receivedClinicData,
        })),
      };
    });

    let store, initialState;
    beforeEach(async () => {
      initialState = {
        user: {
          data: {
            clientId: 'clientid',
            userId: 'userid',
          },
        },
      };

      jest.spyOn(PanelUtils, 'processClinicData');

      store = configureMockStore(mockApi)(initialState);

      await store.dispatch(actions.fetchPanelClinics());
    });

    it('should map consultation type to specialty if specialty is null and consultation type is not', () => {
      const clinicNamesInState = getProperty(clinics(store), 'specialty');
      const expectedSpecialty = ['GP', 'Hospital'];

      expect(clinicNamesInState).toEqual(
        expect.arrayContaining(expectedSpecialty),
      );
    });

    it('should use specialty if it is not null', () => {
      const clinicNamesInState = getProperty(clinics(store), 'specialty');
      const expectedSpecialty = ['GP', 'Hospital'];

      expect(clinicNamesInState).toEqual(
        expect.arrayContaining(expectedSpecialty),
      );
    });
  });

  it('should create an action to update the selected clinic', () => {
    const initialState = {
      panel: {},
    };
    const selectedClinic = {
      latitude: 1.22,
      longitude: 1.34,
      id: 11,
      name: 'Dr abc',
    };
    const expectedActions = [
      {
        type: types.UPDATE_SELECTED_CLINIC,
        payload: selectedClinic,
      },
    ];

    const store = configureMockStore(api)(initialState);

    store.dispatch(actions.updateSelectedClinic(selectedClinic));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it('should return action to update filters with appropriate payload', () => {
    const store = configureMockStore(api)({});
    const updatedFilter = {
      type: FilterTypes.SPECIALTY,
      values: ['HOSPITALS', 'GENERAL_SURGERY'],
    };
    store.dispatch(actions.updateFilter(updatedFilter));
    expect(store.getActions()).toEqual([
      {
        type: types.UPDATE_FILTERS,
        payload: updatedFilter,
      },
    ]);
  });

  it('should return action to clear clinics', () => {
    const store = configureMockStore(api)({});
    store.dispatch(actions.clearClinics());
    expect(store.getActions()).toEqual([
      {
        type: types.CLEAR_PANEL_CLINICS,
        payload: [],
      },
    ]);
  });

  it('should return action to remove all filters', () => {
    const store = configureMockStore(api)({});

    store.dispatch(actions.removeAllFilters());

    expect(store.getActions()).toEqual([
      {
        type: types.REMOVE_ALL_FILTERS,
      },
    ]);
  });

  describe('updateSelectedClinics', () => {
    it('should update selectedClinics', () => {
      const initialState = {
        panel: {
          selectedClinics: [],
        },
      };

      const expectedActions = [
        {
          type: types.UPDATE_SELECTED_CLINICS,
          payload: clinicsData,
        },
      ];

      const store = configureMockStore(api)(initialState);

      store.dispatch(actions.updateSelectedClinics(clinicsData));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
