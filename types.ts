export enum Language {
  ARABIC = 'ar',
  ENGLISH = 'en',
  GERMAN = 'de',
}

export enum IngredientStatus {
  HALAL = 'Halal',
  HARAM = 'Haram',
  MUSHBOOH = 'Mushbooh', // Doubtful
  UNKNOWN = 'Unknown',
}

export interface Ingredient {
  name: string;
  status: IngredientStatus;
  reason: string;
}

export interface AnalysisResult {
  overallStatus: IngredientStatus;
  summary: string;
  ingredients: Ingredient[];
}

export type AppState = 'idle' | 'camera' | 'analyzing' | 'results' | 'error';
