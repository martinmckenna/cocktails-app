import { stringify } from 'querystring';
import request from './request';

interface CocktailParams {
  name?: string;
  ingList?: string;
  willShop?: boolean;
  page?: number;
}

export const getCocktails = (payload: CocktailParams) => {
  const { name, ingList, willShop, page } = payload;
  const params = {
    name: name || '',
    ing_list: ingList || '',
    will_shop: willShop || false,
    page: page || 1
  };
  return request(`/cocktails?${stringify(params)}`).then(
    response => response.data
  );
};
