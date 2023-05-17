/* This file was generated. DO NOT edit by hand. */

export type Path = "destruction" | "the_hunt" | "erudition" | "harmony" | "nihility" | "preservation" | "abundance";
export type CombatType = "physical" | "fire" | "ice" | "lightning" | "wind" | "quantum" | "imaginary";
export type Characters = Character[];

export interface Character {
  id: string;
  $nameJA: string;
  rarity: number;
  path?: Path;
  combatType?: CombatType;
  materials: CharacterMaterialDefinitions;
}
export interface CharacterMaterialDefinitions {
  common: string;
  ascension: string;
  skills?: string;
  skillsAdvanced: string;
}
