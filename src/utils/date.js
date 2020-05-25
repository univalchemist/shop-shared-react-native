import moment from 'moment/min/moment-with-locales';

const getFormattedDate = (date, format = 'DD-MM-YYYY') => {
  if (!date) {
    return '';
  }

  return moment(date).format(format);
};

getFormattedDate.setFormat = (format = 'DD-MM-YYYY') => date => {
  return getFormattedDate(date, format);
};

export { getFormattedDate };

export const getFormattedDateWithMonthAndDay = (date, locale) => {
  if (!moment(date).isValid()) return '';

  if (locale.toLowerCase() === 'zh-hk') {
    return (
      moment(date)
        .locale(locale)
        .format('MMM') +
      moment(date).format('D') +
      '日'
    );
  }

  return getFormattedDate(date, 'D MMM');
};

export const getYearsAgo = minMax => {
  return moment()
    .subtract(minMax, 'years')
    .endOf('day');
};

export const getDateDuration = (now = moment()) => date => {
  return moment.duration(now.diff(date)).asDays();
};

export const getAgeInDays = (now = moment()) => dob => {
  if (!dob.getMonth) {
    dob = moment(dob);
  }

  return getDateDuration(now)(dob);
};
