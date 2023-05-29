/* This file was generated. DO NOT edit by hand. */

export type Character = {
  id: string;
  $nameJA: string;
  yomi: string;
  rarity: number;
  path?: Path;
  combatType?: CombatType;
  materials?: CharacterMaterialDefinitions;
  variants?: CharacterVariant[];
} & Character1;
export type Path = "destruction" | "the_hunt" | "erudition" | "harmony" | "nihility" | "preservation" | "abundance";
export type CombatType = "physical" | "fire" | "ice" | "lightning" | "wind" | "quantum" | "imaginary";
export type Character1 = {} | {};
export type Characters = Character[];

export interface CharacterMaterialDefinitions {
  common: string;
  ascension: string;
  skills: string;
  skillsAdvanced: string;
}
export interface CharacterVariant {
  path: Path;
  combatType: CombatType;
  materials: CharacterMaterialDefinitions;
}
