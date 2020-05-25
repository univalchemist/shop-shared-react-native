import { scheduleMapping, sortSchedule } from '../schedule';

describe('schedule', () => {
  test('scheduleMapping return CLOSED', () => {
    expect(scheduleMapping('00:00-00:00')).toEqual('Closed');
    expect(scheduleMapping('close')).toEqual('Closed');
    expect(scheduleMapping('00:00-00:00', '00:00-00:00')).toEqual('Closed');
  });
  test('scheduleMapping return one opening-hour range', () => {
    expect(scheduleMapping('00:00-00:00', '10:00-20:00')).toEqual(
      '10:00 - 20:00',
    );
    expect(scheduleMapping('10:00-17:00', '00:00-00:00')).toEqual(
      '10:00 - 17:00',
    );
  });
  test('scheduleMapping return enough two opening-hour range', () => {
    expect(scheduleMapping('08:00-12:00', '13:00-17:00')).toEqual(
      '08:00 - 12:00, 13:00 - 17:00',
    );
  });
  test('sortSchedule order correctly', () => {
    const unsorted = [
      ['Sun'],
      ['Tue'],
      ['Mon'],
      ['Wed'],
      ['Thu'],
      ['Fri'],
      ['Sat'],
      ['Public holiday'],
      ['Other holiday'],
    ];
    const expected = [
      ['Mon'],
      ['Tue'],
      ['Wed'],
      ['Thu'],
      ['Fri'],
      ['Sat'],
      ['Sun'],
      ['Public holiday'],
      ['Other holiday'],
    ];
    expect(sortSchedule(unsorted)).toEqual(expected);
  });
});
