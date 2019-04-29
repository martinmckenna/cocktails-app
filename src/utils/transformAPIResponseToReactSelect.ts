import { Ingredient, PaginatedData } from 'src/services/types';

export const transformAPIResponseToReactSelect = (
  response: PaginatedData<Ingredient>
) => {
  return response.data.map(eachIngredient => ({
    key: eachIngredient.id,
    value: eachIngredient.id,
    label: eachIngredient.name
  }));
};
