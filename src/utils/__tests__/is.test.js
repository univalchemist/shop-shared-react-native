import { isFunc, isNotEmpty } from '../is';

describe('is.js', () => {
  it('should return true when call isFunc with param is function', () => {
    const param = () => {};
    const result = isFunc(param);
    expect(result).toEqual(true);
  });
  it('should return false when call isFunc with param is not function', () => {
    const param = 123;
    const result = isFunc(param);
    expect(result).toEqual(false);
  });
  it('should return false when call isNotEmpty with param is empty object', () => {
    const param = {};
    const result = isNotEmpty(param);
    expect(result).toEqual(false);
  });
  it('should return false when call isNotEmpty with param is empty array', () => {
    const param = [];
    const result = isNotEmpty(param);
    expect(result).toEqual(false);
  });
  it('should return true when call isNotEmpty with param is not empty array', () => {
    const param = [1, 2];
    const result = isNotEmpty(param);
    expect(result).toEqual(true);
  });
  it('should return true when call isNotEmpty with param is not empty object', () => {
    const param = { a: 1 };
    const result = isNotEmpty(param);
    expect(result).toEqual(true);
  });
});
