import {
  GetDisplayRelationship,
  IsCategorySpouse,
  IsCategoryChild,
} from '@utils';

describe("Utils for checking a user's relationship to an Employee", () => {
  test('should return empty display relationship if no relationship is provided', () => {
    const relationship = GetDisplayRelationship();
    expect(relationship).toEqual('');
  });

  test('should return display relationship if no Pascalcase is provided', () => {
    const relationship = GetDisplayRelationship('Child');
    expect(relationship).toEqual('Child');
  });

  test('should return display relationship separated by spaces if Pascalcase is provided', () => {
    const relationship = GetDisplayRelationship('StepChildRelationship');
    expect(relationship).toEqual('Step Child Relationship');
  });

  test('should return true if user is a Spouse of an Employee', () => {
    const category = 'Spouse';
    expect(IsCategorySpouse(category)).toEqual(true);
  });

  test('should return false if user is not a Spouse of an Employee', () => {
    const category = 'Child';
    expect(IsCategorySpouse(category)).toEqual(false);
  });

  test('should return true if user is a Spouse of an Employee ignorecase', () => {
    const category = 'SPOUSE';
    expect(IsCategorySpouse(category)).toEqual(true);
  });

  test('should return false if relationship is not passed as a parameter to IsCategorySpouse', () => {
    expect(IsCategorySpouse()).toEqual(false);
  });

  test('should return true if user is a Child of an Employee', () => {
    const category = 'Child';
    expect(IsCategoryChild(category)).toEqual(true);
  });

  test('should return false if user is not a Child of an Employee', () => {
    const category = 'Spouse';
    expect(IsCategoryChild(category)).toEqual(false);
  });

  test('should return true if user is a Child of an Employee ignorecase', () => {
    const category = 'CHILD';
    expect(IsCategoryChild(category)).toEqual(true);
  });

  test('should return false if role is not passed as a parameter to IsCategoryChild', () => {
    expect(IsCategoryChild()).toEqual(false);
  });
});
