import ShowAllClinicsFilter from '../ShowAllClinicsFilter';

describe('ShowAllClinicsFilter', () => {
  it('should return all clinics', () => {
    const filter = new ShowAllClinicsFilter();
    const clinics = [{ name: 'clinic 1' }, { name: 'clinic 2' }];
    const actual = filter.filter(clinics);

    expect(actual).toEqual(clinics);
  });
});
