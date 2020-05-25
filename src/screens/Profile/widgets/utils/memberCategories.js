const TIER_3 = 'tier 3';

export const isTier3 = (category = '') => {
  return category !== null && category.toLowerCase() === TIER_3;
};
