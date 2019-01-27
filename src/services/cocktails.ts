import request from './request';

export const getCocktails = () => {
  return request('/cocktails').then(response => response.data);
};
