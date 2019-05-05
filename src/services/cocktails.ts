import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';
import request from './request';
import { Cocktail, PaginatedData } from './types';

interface CocktailParams {
  name?: string;
  ingList?: string;
  willShop?: boolean;
  page?: number;
}

export type GlassType = '' | 'Rocks' | 'Highball' | 'Snifter';

export type ActionType = '' | 'Add' | 'Muddle' | 'Squeeze';

export type Finishes = string | null;

export interface Ingredient {
  ounces: number;
  id: number;
  step: number;
  action: ActionType;
}

export interface CreatePayload {
  name: string;
  glass: GlassType;
  finish: Finishes;
  ingredients: Ingredient[];
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
    (response: AxiosResponse<PaginatedData<Cocktail>>) => response.data
  );
};

export const createCocktail = (payload: CreatePayload) => {
  if (!payload.finish) {
    delete payload.finish;
  }
  return request(`/cocktails`, {
    method: 'POST',
    data: payload
  }).then((response: AxiosResponse<Cocktail[]>) => response.data);
};
