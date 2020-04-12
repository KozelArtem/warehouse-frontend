const buildUrl = (url, query) => {
  const queryString = Object.keys(query)
    .reduce((acc, key) => `${acc}&${key}=${query[key]}`, '');

  return `${url}?${queryString}`;
};

const getTotalCountFromHeaders = response => +response.headers['x-total-count'];

export {
  buildUrl,
  getTotalCountFromHeaders,
};
