import React from 'react';
import { renderForTest } from '@testUtils';
import SingleMapMarker from '../SingleMapMarker';
import NonSelectedMapMarker from '../NonSelectedMapMarker';
import SelectedMapMarker from '../SelectedMapMarker';
import { updateSelectedClinics } from '@store/panel/actions';

jest.mock('@store/panel/actions', () => ({
  ...jest.requireActual('../../../../../store/panel/actions'),
  updateSelectedClinics: jest.fn(clinics => {
    return {
      type: 'UPDATE_SELECTED_CLINICS',
      payload: clinics,
    };
  }),
}));

describe('SingleMapMarker', () => {
  const clinic = {
    location: {
      longitude: -21.466,
      latitude: 47.21,
    },
    id: 213,
  };

  const renderMapMarker = ({ data = clinic, selectedClinics }) =>
    renderForTest(<SingleMapMarker data={data} />, {
      initialState: { panel: { selectedClinics } },
    });

  const nonSelectedMapMarker = component =>
    component.queryByType(NonSelectedMapMarker);

  const selectedMapMarker = component =>
    component.queryByType(SelectedMapMarker);

  describe.each`
    selectedClinics                                   | description
    ${[]}                                             | ${'when there is no selected clinic'}
    ${[{ ...clinic, id: 21 }, { ...clinic, id: 22 }]} | ${'when current clinic has more than one clinics'}
    ${[{ ...clinic, id: 21 }]}                        | ${'when current clinic is not the selected clinic'}
  `('$description', ({ selectedClinics }) => {
    let component;
    beforeEach(() => {
      updateSelectedClinics.mockClear();
      component = renderMapMarker({ selectedClinics, data: clinic });
    });

    it('should render a NonSelectedMapMarker', () => {
      expect(component.queryAllByType(NonSelectedMapMarker)).toHaveLength(1);
    });

    it('should pass data to NonSelectedMapMarker', () => {
      expect(nonSelectedMapMarker(component).props.data).toBe(clinic);
    });

    it('should pass action to updateSelectedClinics with data to NonSelectedMapMarker', async () => {
      nonSelectedMapMarker(component).props.onPress();
      expect(updateSelectedClinics).toHaveBeenCalledWith([clinic]);
    });
  });

  describe('when current clinic is selected', () => {
    let component;
    beforeEach(() => {
      component = renderMapMarker({ selectedClinics: [clinic], data: clinic });
    });

    it('should render a SelectedMapMarker', () => {
      expect(component.queryAllByType(SelectedMapMarker)).toHaveLength(1);
    });

    it('should pass data to SelectedMapMarker', () => {
      expect(selectedMapMarker(component).props.data).toBe(clinic);
    });
  });
});
