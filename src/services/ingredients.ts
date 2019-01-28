import { AxiosResponse } from 'axios';
import request from './request';
import { Ingredient, PaginatedData } from './types';

interface IngredientsParams {
  name?: string;
  page?: number;
}

export const getIngredients = (params: IngredientsParams) => {
  return request(`/ingredients?name=${params.name}&page=${params.page}`).then(
    (response: AxiosResponse<PaginatedData<Ingredient>>) => response.data
  );
};
