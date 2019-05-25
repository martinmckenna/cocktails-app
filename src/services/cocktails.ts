import Axios, { AxiosResponse } from 'axios';
import { unescape } from 'he';
import { stringify } from 'querystring';
import { imgurToken } from 'src/constants';
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
  unit: string;
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

  if (!params.ing_list) {
    delete params.ing_list;
  }

  return request(`/cocktails?${stringify(params)}`).then(
    (response: AxiosResponse<PaginatedData<Cocktail>>) => response.data
  );
};

export const getCocktail = (id: number) => {
  return request(`/cocktails/${id}`).then(
    (response: AxiosResponse<Cocktail>) => response.data
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

interface ImgurImg {
  id: string;
  title: string;
  description: string | null;
  height: number;
  width: number;
  link: string;
}

interface ImgurWrapper {
  data: ImgurImg[];
  success: boolean;
  status: number;
}

export const getCocktailImages = (query: string) => {
  return Axios('https://api.imgur.com/3/gallery/search/top/', {
    method: 'GET',
    params: {
      q_all: `${query}`,
      // q_or: `cocktail drink`,
      q_type: 'jpg',
      // q_size_px: 'huge',
      // window: 'year',
      q_not: 'cupcakes me'
    },
    headers: {
      Authorization: `Client-ID ${imgurToken}`
    }
  }).then((response: AxiosResponse<ImgurWrapper>) => {
    try {
      return response.data.data.length === 0
        ? response.data.data
        : response.data.data.map(eachImage => ({
            ...eachImage,
            link: unescape(eachImage.link)
          }));
    } catch (e) {
      throw new Error(e);
    }
  });
};

export const deleteCocktail = (id: number) => {
  return request(`/cocktails/${id}`, {
    method: 'DELETE'
  }).then((response: AxiosResponse<{}>) => response.data);
};
