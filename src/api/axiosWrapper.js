import Axios from 'axios';

import { baseURL } from './urls';

const METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

const getToken = () => localStorage.getItem('token');

const axios = Axios.create();

const buildUrl = (url, query) => {
  const queryString = Object.keys(query)
    .reduce((acc, key) => `${acc}&${key}=${query[key]}`, '');

  return `${url}?${queryString}`;
};

const request = (method, url, data) => axios.request({
  method,
  headers: {
    Authorization: getToken(),
  },
  baseURL,
  url,
  data,
});

export { METHODS, request, buildUrl };
