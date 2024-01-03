import characters from "~/assets/data/characters.yaml"
import {CombatType, Path} from "~/types/generated/characters.g"

const trailblazerCombatTypeToPath = (combatType: string): Path => {
  switch (combatType as CombatType) {
    case "physical":
      return "destruction"
    case "fire":
      return "preservation"
    default:
      return "destruction"
  }
}

export const parseShowcaseCharacterId = (nameJP: string, variant: string) => {
  return nameJP === "開拓者"
    ? toCharacterIdWithVariant("trailblazer", trailblazerCombatTypeToPath(variant))
    : characters.find(e => e.$nameJA === nameJP)?.id
}
