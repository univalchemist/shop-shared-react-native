import { isEmptyString } from '../isEmptyString';

describe('isEmptyString', () => {
  it('should return true if input is null', () => {
    expect(isEmptyString(null)).toEqual(true);
  });
  it('should return true if input is undefined', () => {
    expect(isEmptyString(undefined)).toEqual(true);
  });
  it('should return true if input is empty string', () => {
    expect(isEmptyString('   ')).toEqual(true);
  });
  it('should return true if input is number', () => {
    expect(isEmptyString(123)).toEqual(true);
  });
  it('should return false if input is not empty string', () => {
    expect(isEmptyString('123')).toEqual(false);
  });
});
