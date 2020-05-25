export const buildProductsUrl = (path, params = {}) => {
  let url = path;

  let separator = '?';
  Object.keys(params).forEach(key => {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => {
        url += `${separator}${key}=${value}`;
        separator = '&';
      });
    } else {
      url += `${separator}${key}=${params[key]}`;
      separator = '&';
    }
  });

  return url;
};
