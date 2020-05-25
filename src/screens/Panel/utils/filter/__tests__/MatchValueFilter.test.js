import MatchValueFilter from '../MatchValueFilter';

describe('MatchValueFilter', () => {
  it('returns the items whose value for the corresponding property match filter values', () => {
    const filter = new MatchValueFilter({
      type: 'propertyA',
      values: ['one', 'three'],
    });

    const actual = filter.filter([
      { propertyA: 'one', name: 'one' },
      { propertyA: 'two', name: 'two' },
      { propertyA: 'three', name: 'three' },
    ]);

    const expected = [
      { propertyA: 'one', name: 'one' },
      { propertyA: 'three', name: 'three' },
    ];
    expect(actual).toEqual(expected);
  });

  it('returns empty array when there is no match', () => {
    const filter = new MatchValueFilter({
      type: 'propertyA',
      values: ['one'],
    });

    const actual = filter.filter([
      { propertyA: 'two', name: 'two' },
      { propertyA: 'three', name: 'three' },
    ]);

    expect(actual).toEqual([]);
  });
});
