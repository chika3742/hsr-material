/* This file was generated. DO NOT edit by hand. */

export interface CharacterIngredients {
  exp: {
    itemId: string;
    expPerItem: number;
  }[];
  ascension: LevelIngredients[];
  basicAttack: LevelIngredients[];
  skill: LevelIngredients[];
  ultimate: LevelIngredients[];
  talent: LevelIngredients[];
}
export interface LevelIngredients {
  level: number;
  ingredients: Ingredient[];
}
export interface Ingredient {
  fixedId?: string;
  type?: "common" | "ascension" | "skills" | "skillsAdvanced";
  quantity?: number;
  exp?: number;
  craftLevel?: number;
}
