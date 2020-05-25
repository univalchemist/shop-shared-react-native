const data = [
  {
    score: 100,
    createdOn: '2019-01-12T00:00:00',
  },
  {
    score: 25,
    createdOn: '2019-01-31T00:00:00',
  },
  {
    score: 1,
    createdOn: '2019-02-28T00:00:00',
  },
  {
    score: 0,
    createdOn: '2019-03-03T00:00:00',
  },
  {
    score: 75,
    createdOn: '2019-03-23T00:00:00',
  },
  {
    score: 100,
    createdOn: '2019-04-14T00:00:00',
  },
];

const dataIncomplete = [
  {
    score: 100,
    createdOn: '2019-01-12T00:00:00',
  },
  {
    score: 25,
    createdOn: '2019-01-31T00:00:00',
  },
  {
    score: 1,
    createdOn: '2019-02-28T00:00:00',
  },
];

const dataWithExcessDataPoints = [
  {
    score: 100,
    createdOn: '2019-01-12T00:00:00',
  },
  {
    score: 25,
    createdOn: '2019-01-31T00:00:00',
  },
  {
    score: 1,
    createdOn: '2019-02-28T00:00:00',
  },
  {
    score: 0,
    createdOn: '2019-03-03T00:00:00',
  },
  {
    score: 75,
    createdOn: '2019-03-23T00:00:00',
  },
  {
    score: 100,
    createdOn: '2019-04-14T00:00:00',
  },
  {
    score: 75,
    createdOn: '2019-03-23T00:00:00',
  },
  {
    score: 100,
    createdOn: '2019-04-14T00:00:00',
  },
];

const dataConsumed = [
  {
    value: 100,
    createdOn: '12 Jan',
  },
  {
    value: 25,
    createdOn: '31 Jan',
  },
  {
    value: 1,
    createdOn: '28 Feb',
  },
  {
    value: 0,
    createdOn: '3 Mar',
  },
  {
    value: 75,
    createdOn: '23 Mar',
  },
  {
    value: 100,
    createdOn: '14 Apr',
  },
];

const dataConsumedIncomplete = [
  {
    value: 100,
    createdOn: '12 Jan',
  },
  {
    value: 25,
    createdOn: '31 Jan',
  },
  {
    value: 1,
    createdOn: '28 Feb',
  },
  {
    value: 0,
    createdOn: '',
  },
  {
    value: 0,
    createdOn: '',
  },
  {
    value: 0,
    createdOn: '',
  },
];

const dataConsumedWithExcessDataPoints = [
  {
    value: 1,
    createdOn: '28 Feb',
  },
  {
    value: 0,
    createdOn: '3 Mar',
  },
  {
    value: 75,
    createdOn: '23 Mar',
  },
  {
    value: 100,
    createdOn: '14 Apr',
  },
  {
    value: 75,
    createdOn: '23 Mar',
  },
  {
    value: 100,
    createdOn: '14 Apr',
  },
];

export {
  data,
  dataIncomplete,
  dataWithExcessDataPoints,
  dataConsumed,
  dataConsumedIncomplete,
  dataConsumedWithExcessDataPoints,
};
