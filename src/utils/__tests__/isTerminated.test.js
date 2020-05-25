import {
  isTerminatedOrExtended,
  TERMINATED,
  isOnExtendedTime,
} from '../isTerminated';

describe('isTerminatedOrExtended Utils', () => {
  it('should return true when user status is "TERMINATED"', () => {
    const result = isTerminatedOrExtended(TERMINATED);
    expect(result).toEqual(true);
  });
  it('should return false when user status is not TERMINATED', () => {
    const result = isTerminatedOrExtended('NONE');
    expect(result).toEqual(false);
  });
});

describe('isOnExtendedTime ', () => {
  it('should return true when limitedAccessUntil is greater than today"', () => {
    const limitedAccessUntil = '2030-12-05T16:00:00';
    const result = isOnExtendedTime(limitedAccessUntil);
    expect(result).toEqual(true);
  });
  it('should return false when limitedAccessUntil is less than today', () => {
    const limitedAccessUntil = '2018-12-05T16:00:00';
    const result = isOnExtendedTime(limitedAccessUntil);
    expect(result).toEqual(false);
  });
  it('should return false when limitedAccessUntil is undefined', () => {
    const limitedAccessUntil = undefined;
    const result = isOnExtendedTime(limitedAccessUntil);
    expect(result).toEqual(false);
  });
});
