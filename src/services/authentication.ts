import { AxiosResponse } from 'axios';
import request from './request';

export const login = (username: string, password: string) => {
  return request('/login', {
    auth: {
      username,
      password
    }
  }).then((response: AxiosResponse<string>) => response.data);
};
