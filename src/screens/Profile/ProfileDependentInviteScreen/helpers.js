export const isMatched = (a, b) => {
  if (!a || !b) {
    return false;
  }

  return a.toLowerCase() === b.toLowerCase();
};
