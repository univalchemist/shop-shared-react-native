import moment from 'moment';

const CLOSED = 'Closed';
export const MOMENT_INVALID_DATE = 'Invalid date';

const convertToClosed = openingHour => {
  if (!openingHour) return CLOSED;
  const count = openingHour.match(/00:00/g);
  if (
    (count && count.length > 1) ||
    openingHour.toLowerCase().includes('close')
  ) {
    openingHour = CLOSED;
  }
  return openingHour;
};

export const scheduleMapping = (morning, afternoon) => {
  morning = convertToClosed(morning);
  afternoon = convertToClosed(afternoon);

  if (morning === CLOSED && afternoon === CLOSED) return CLOSED;
  else if (morning !== CLOSED && afternoon !== CLOSED)
    return morning.replace('-', ' - ') + ', ' + afternoon.replace('-', ' - ');
  else
    return morning === CLOSED
      ? afternoon.replace('-', ' - ')
      : morning.replace('-', ' - ');
};

const weekdayOrder = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
  MOMENT_INVALID_DATE: 7,
};

export const sortSchedule = schedule => {
  return schedule.sort((s1, s2) => {
    const d1 = moment(s1[0], 'ddd').format('dddd');
    const d2 = moment(s2[0], 'ddd').format('dddd');
    if (weekdayOrder[d1] < weekdayOrder[d2]) return -1;
    else if (weekdayOrder[d1] > weekdayOrder[d2]) return 1;
    else return 0;
  });
};
