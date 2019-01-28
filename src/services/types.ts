export interface Ingredient {
  id: number;
  ing_type: string;
  name: string;
}

export interface PaginatedData<T> {
  data: T[];
  pages: number;
  total_results: number;
}

export interface APIError {
  error: string;
  meta?: string;
}

interface IngInCocktail {
  name: string;
  type: string;
  id: number;
  ounces: number;
  action: string;
  step: number;
}

export interface Cocktail {
  id: number;
  ingredients: IngInCocktail[];
  name: string;
  glass: string;
  finish: null | 'stirred' | 'shaken';
}
