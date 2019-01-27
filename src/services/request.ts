import Axios, { AxiosError } from 'axios';
import { APIError } from './types';

const request = Axios.create({ baseURL: 'https://api.barcart.net/' });

request.interceptors.response.use(
  response => response,
  (err: AxiosError): Promise<APIError> => {
    return err.response
      ? Promise.reject(err.response)
      : Promise.reject([
          {
            error: 'There was an error'
          }
        ]);
  }
);

export default request;
