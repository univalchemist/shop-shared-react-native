import { isTier3 } from '../memberCategories';

describe('MemberCategories Utils', () => {
  it('should return true when member category is tier 3', () => {
    const result = isTier3('Tier 3');
    expect(result).toEqual(true);
  });
  it('should return false when member category is not tier 3', () => {
    const result = isTier3('Tier 2');
    expect(result).toEqual(false);
  });
});
