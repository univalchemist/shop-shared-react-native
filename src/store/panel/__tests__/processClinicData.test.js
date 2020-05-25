import { processClinicData } from '../processClinicData';

describe('processClinicData', () => {
  const hasOnlyDistinctValues = values => {
    const distinctValues = new Set(values);
    return values.length === distinctValues.size;
  };

  const hasDistinctPropertiesCombination = (items, ...properties) => {
    const propertyValues = items.map(item =>
      properties.map(property => item[property]).join(','),
    );
    return hasOnlyDistinctValues(propertyValues);
  };

  describe('For clinics at the same location', () => {
    it('should make their display coordinates different so that marker pins are not overlapping', () => {
      const baseClinicData = {
        latitude: 114.1592606,
        longitude: 22.281237,
      };
      const clinic1 = { ...baseClinicData, name: 'Dr. Lau Yee Lam Eileen' };
      const clinic2 = { ...baseClinicData, name: 'Dr. Wong Tai Chiu' };
      const clinic3 = { ...baseClinicData, name: 'UMP Medical Centre' };

      const clinicsWithSameCoordinates = [clinic1, clinic2, clinic3];
      const processedClinics = processClinicData(clinicsWithSameCoordinates);

      expect(
        hasDistinctPropertiesCombination(
          processedClinics,
          'displayLongitude',
          'displayLatitude',
        ),
      ).toBe(true);
    });
  });

  describe('For clinics at different locations', () => {
    const properties = (items, ...names) =>
      items.map(item => names.map(name => item[name]));
    it('should use their actual coordinates as display coordinates', () => {
      const clinics = [
        {
          name: 'Dr Wu',
          longitude: 114.155372,
          latitude: 22.247869,
        },
        {
          name: 'Surgeon Leong',
          longitude: 114.1592606,
          latitude: 22.281237,
        },
        {
          name: 'Prof Ian',
          longitude: 114.169831,
          latitude: 22.3198072,
        },
      ];

      const processedClinics = processClinicData(clinics);

      expect(
        properties(processedClinics, 'displayLongitude', 'displayLatitude'),
      ).toEqual(properties(processedClinics, 'longitude', 'latitude'));
    });
  });
});
