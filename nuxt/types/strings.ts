import {CharacterIngredients} from "~/types/generated/character-ingredients.g"

export type ThemeSetting = "dark" | "light" | "auto"

export type TargetType = "character" | "light_cone"

export type PurposeType = keyof CharacterIngredients

export type Stat =
  | "hp"
  | "atk"
  | "def"
  | "hp_percent"
  | "atk_percent"
  | "def_percent"
  | "crit_rate"
  | "crit_dmg"
  | "outgoing_healing"
  | "effect_hit_rate"
  | "speed"
  | "physical_dmg"
  | "fire_dmg"
  | "ice_dmg"
  | "lightning_dmg"
  | "wind_dmg"
  | "quantum_dmg"
  | "imaginary_dmg"
  | "break_effect"
  | "energy_regen_rate"
  | "effect_res"
