/* This file was generated. DO NOT edit by hand. */

export interface LightConeIngredients {
  exp: {
    itemId: string;
    expPerItem: number;
  }[];
  ascension: LevelIngredients[];
}

export interface LevelIngredients {
  level: number;
  ingredients: Ingredient[];
}

export interface Ingredient {
  fixedId?: string;
  type?: "common" | "primary" | "ascension" | "skills" | "skillsAdvanced";
  quantity?: number;
  exp?: number;
  craftLevel?: number;
}
