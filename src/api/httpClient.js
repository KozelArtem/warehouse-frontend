import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});

const getAuthToken = () => localStorage.getItem('token');

const authInterceptor = (config) => {
  config.headers.Authorization = getAuthToken();

  return config;
};

const errorInterceptor = (error) => {
  // all the error responses
  switch (error.response.status) {
    case 400:
      console.error(error.response.status, error.message);
      break;

    case 401: // authentication error, logout the user
      localStorage.removeItem('token');
      break;

    default:
      console.error(error.response.status, error.message);
  }
  return Promise.reject(error);
};

// Interceptor for responses
const responseInterceptor = (response) => {
  switch (response.status) {
    case 200:
      // yay!
      break;
      // any other cases
    default:
      // default case
  }

  return response;
};

httpClient.interceptors.response.use(responseInterceptor, errorInterceptor);

httpClient.interceptors.request.use(authInterceptor);

export default httpClient;
