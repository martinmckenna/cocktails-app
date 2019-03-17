import { AxiosResponse } from 'axios';
import request from './request';
import { Ingredient, PaginatedData } from './types';

interface IngredientsParams {
  name?: string;
  page?: number;
}

export type IngTypes = '' | 'Juice' | 'Liquor' | 'Fruit';

export const getIngredients = (params: IngredientsParams) => {
  return request(`/ingredients?name=${params.name}&page=${params.page}`).then(
    (response: AxiosResponse<PaginatedData<Ingredient>>) => response.data
  );
};

interface CreateParams {
  name: string;
  ing_type: IngTypes;
}

export const createIngredient = (payload: CreateParams) => {
  if (!payload.name) {
    return Promise.reject({
      error: 'You must enter a name',
      field: 'name'
    });
  }

  if (!payload.ing_type) {
    return Promise.reject({
      error: 'You must enter a type',
      field: 'type'
    });
  }

  return request('/ingredients', {
    method: 'POST',
    data: payload
  }).then((response: AxiosResponse<Ingredient>) => response.data);
};
