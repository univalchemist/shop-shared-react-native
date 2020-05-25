import moment from 'moment';
import {
  getFormattedDate,
  getFormattedDateWithMonthAndDay,
  getAgeInDays,
} from '../';

describe('@util/date', () => {
  describe('getFormattedDate', () => {
    it('should return formmatted date string (standard)', () => {
      expect(getFormattedDate('2010-01-01T00:00:00', 'DD MMM YYYY')).toBe(
        '01 Jan 2010',
      );
      expect(getFormattedDate('2010-01-01T00:00:00')).toBe('01-01-2010');
    });

    it('should return formmatted date string (flip, curry - setFormat)', () => {
      expect(
        getFormattedDate.setFormat('DD MMM YYYY')('2000-07-01T00:00:00'),
      ).toBe('01 Jul 2000');
      expect(getFormattedDate.setFormat()('2000-07-01T00:00:00')).toBe(
        '01-07-2000',
      );
    });

    it('should return empty string if no date provide', () => {
      expect(getFormattedDate('', 'DD MMM YYYY')).toBe('');
    });
  });

  describe('getFormattedDateWithMonthAndDay', () => {
    it('should format date in correctly for zh-hk', () => {
      const date = '2019-12-28T10:00:00';
      const locale = 'zh-hk';
      const formattedDate = getFormattedDateWithMonthAndDay(date, locale);

      expect(formattedDate).toBe('12月28日');
    });

    it('should format date in correctly for other language', () => {
      const date = '2019-12-28T10:00:00';
      const locale = 'en-HK';
      const formattedDate = getFormattedDateWithMonthAndDay(date, locale);

      expect(formattedDate).toBe('28 Dec');
    });

    it('should return empty string if date passed in invalid', () => {
      const date = 'invalid-date';
      const locale = 'en-HK';
      const formattedDate = getFormattedDateWithMonthAndDay(date, locale);

      expect(formattedDate).toBe('');
    });
  });

  describe('getAgeInDays', () => {
    const now = moment('2020-02-01T00:00:00');

    it('should return age difference (by string type DoB)', () => {
      const dob = '2010-01-01T00:00:00';

      expect(getAgeInDays(now)(dob)).toBe(3683);
    });

    it('should return age difference (by date type DoB)', () => {
      const dob = new Date('2000-01-01T00:00:00');

      expect(Math.floor(getAgeInDays(now)(dob))).toBe(7336);
    });
  });
});
