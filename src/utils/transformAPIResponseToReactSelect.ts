import { Cocktail, Ingredient, PaginatedData } from 'src/services/types';

export const transformAPIResponseToReactSelect = (
  response: PaginatedData<Ingredient>
) => {
  return response.data.map(eachIngredient => ({
    key: eachIngredient.id,
    value: eachIngredient.id,
    label: eachIngredient.name
  }));
};

export const transformCocktailResponseToReactSelect = (
  response: PaginatedData<Cocktail>
) => {
  return response.data.map(eachCocktail => ({
    key: eachCocktail.id,
    value: eachCocktail.id,
    label: eachCocktail.name
  }));
};
