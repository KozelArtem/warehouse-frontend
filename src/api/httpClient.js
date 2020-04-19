import axios from 'axios';

import store from '../store';

const httpClient = axios.create({
  baseURL: 'https://mpp-dev.herokuapp.com/',
  timeout: 5000,
});


const getAuthToken = () => store.getters['Auth/token'];

const authInterceptor = (config) => {
  config.headers.Authorization = getAuthToken();

  return config;
};

const errorInterceptor = error => store.dispatch('handleError', error.response);
const responseInterceptor = response => response;

httpClient.interceptors.request.use(authInterceptor);
httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default httpClient;
