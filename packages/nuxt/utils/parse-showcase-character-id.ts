import characters from "~/assets/data/characters.yaml"
import type { HsrCombatType, HsrPath } from "~/types/data/enums"

const trailblazerCombatTypeToPath = (combatType: string): HsrPath => {
  switch (combatType as HsrCombatType) {
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
