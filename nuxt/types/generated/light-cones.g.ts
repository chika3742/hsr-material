/* This file was generated. DO NOT edit by hand. */

export type LightCones = LightCone[];

export interface LightCone {
  id: string;
  $nameJA: string;
  rarity: number;
  path: "destruction" | "the_hunt" | "erudition" | "harmony" | "nihility" | "preservation" | "abundance";
  materials: LightConeMaterialDefinitions;
}

export interface LightConeMaterialDefinitions {
  primary: string;
  common: string;
}
