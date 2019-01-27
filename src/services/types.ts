interface Ingredient {
  id: number;
  ing_type: string;
  name: string;
}

export interface PaginatedIngredients {
  ingredients: Ingredient[];
  pages: number;
  total_results: number;
}

export interface APIError {
  error: string;
  meta?: string;
}
