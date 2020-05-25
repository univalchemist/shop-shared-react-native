import React from 'react';
import ClinicCard from '../ClinicCard';
import NoClinicCard from '../NoClinicCard';
import NoSelectedClinicCard from '../NoSelectedClinicCard';
import { ClinicDetailsCard } from '../ClinicDetailsCard';
import MultipleClinicsCard from '../MultipleClinicsCard';
import { renderForTest } from '@testUtils';

describe('ClinicCard', () => {
  const renderClinicCard = ({ selectedClinics, clinics = [] }) =>
    renderForTest(<ClinicCard />, {
      initialState: {
        heal: {
          clinicData: {
            selectedClinics,
            clinics,
          },
        },
      },
    });

  const clinicDetailsCard = component =>
    component.queryByType(ClinicDetailsCard);

  const multipleClinicsCard = component =>
    component.queryByType(MultipleClinicsCard);

  const clinics = [
    {
      address: '10 Cross Street',
      latitude: 27.12,
      longitude: 37.7,
      name: 'Clinic 1',
      specialty: 'Surgeon',
    },
    {
      address: '401 Sixth Avenue',
      latitude: 14.17,
      longitude: 74.13,
      name: 'Clinic 2',
      specialty: 'Emergency',
    },
  ];

  it('should render a NoClinicCard when there is no filtered clinic', () => {
    const { queryAllByType } = renderClinicCard({ clinics: [] });

    expect(queryAllByType(NoClinicCard)).toHaveLength(1);
  });

  it('should render a NoSelectedClinicCard when there is some filtered clinic but selectedClinics is an empty array', () => {
    const { queryAllByType } = renderClinicCard({
      clinics: clinics,
      selectedClinics: [],
    });

    expect(queryAllByType(NoSelectedClinicCard)).toHaveLength(1);
  });

  describe('when there is one selected clinic', () => {
    let component, selectedClinics;
    beforeEach(() => {
      selectedClinics = [clinics[0]];
      component = renderClinicCard({
        clinics: clinics,
        selectedClinics,
      });
    });

    it('should render a ClinicDetailsCard', () => {
      expect(component.queryAllByType(ClinicDetailsCard)).toHaveLength(1);
    });

    it('should pass one selected clinic', () => {
      expect(clinicDetailsCard(component).props.clinic).toBe(
        selectedClinics[0],
      );
    });
  });

  describe('when there is more than one selected clinics', () => {
    let component, selectedClinics;
    beforeEach(() => {
      selectedClinics = [clinics[0], clinics[1]];
      component = renderClinicCard({
        clinics: clinics,
        selectedClinics,
      });
    });

    it('should render a MultipleClinicsCardTemp', () => {
      expect(component.queryAllByType(MultipleClinicsCard)).toHaveLength(1);
    });

    it('should pass all selected clinics to MultipleClinicsCardTemp', () => {
      expect(multipleClinicsCard(component).props.clinics).toBe(
        selectedClinics,
      );
    });
  });
});
