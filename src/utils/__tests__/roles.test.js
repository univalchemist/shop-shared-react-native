import { IsEmployee, IsDependent } from '@utils';

describe("Utils for checking a user's role", () => {
  test('should return true if user is an Employee', () => {
    const role = 'employee';
    expect(IsEmployee(role)).toEqual(true);
  });

  test('should return false if user is a Dependent', () => {
    const role = 'dependent';
    expect(IsEmployee(role)).toEqual(false);
  });

  test('should return true if user is an Employee ignorecase', () => {
    const role = 'EMPLOYEE';
    expect(IsEmployee(role)).toEqual(true);
  });

  test('should return false if role is not passed as a parameter to IsEmployee', () => {
    expect(IsEmployee()).toEqual(false);
  });

  test('should return true if user is an Dependent', () => {
    const role = 'dependent';
    expect(IsDependent(role)).toEqual(true);
  });

  test('should return false if user is an Employee', () => {
    const role = 'employee';
    expect(IsDependent(role)).toEqual(false);
  });

  test('should return true if user is a Dependent ignorecase', () => {
    const role = 'DEPENDENT';
    expect(IsDependent(role)).toEqual(true);
  });

  test('should return false if role is not passed as a parameter to IsDependent', () => {
    expect(IsDependent()).toEqual(false);
  });
});
