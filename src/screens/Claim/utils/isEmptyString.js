export const isEmptyString = str => {
  if (typeof str !== 'string') return true;
  return !str.trim();
};
