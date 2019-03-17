import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { apiToken } from 'src/constants';
import { APIError } from './types';

const request = Axios.create({ baseURL: 'https://api.barcart.net/' });

request.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = !!apiToken ? apiToken : '';

    return {
      ...config,
      headers: {
        ...config.headers,
        'x-access-token': token
      }
    };
  }
);

request.interceptors.response.use(
  response => response,
  (err: AxiosError): Promise<APIError> => {
    return err.response && err.response.data
      ? Promise.reject(err.response.data)
      : Promise.reject([
          {
            error: 'There was an error'
          }
        ]);
  }
);

export default request;
