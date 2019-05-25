import { AxiosResponse } from 'axios';
import request from './request';
import { Account } from './types';

export const getAccount = () => {
  return request('/profile').then(
    (response: AxiosResponse<Account>) => response.data
  );
};
