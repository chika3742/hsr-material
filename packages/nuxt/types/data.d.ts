declare module "~/assets/data/release-notes.yaml" {
  import type { ReleaseNotes } from "~/types/generated/release-notes.g"

  const releaseNotes: ReleaseNotes
  export default releaseNotes
}

declare module "~/assets/data/characters.yaml" {
  import type { Characters } from "~/types/generated/characters.g"

  const characters: Characters
  export default characters
}

declare module "~/assets/data/character-ingredients.yaml" {
  import type { CharacterIngredients } from "~/types/generated/character-ingredients.g"

  const characterIngredients: CharacterIngredients
  export default characterIngredients
}

declare module "~/assets/data/light-cones.yaml" {
  import type { LightCone } from "~/types/generated/light-cones.g"

  const lightCones: (LightCone & Record<string, unknown>)[]
  export default lightCones
}

declare module "~/assets/data/light-cone-ingredients.yaml" {
  import type { LightConeIngredients } from "~/types/generated/light-cone-ingredients.g"

  const lightConeIngredients: LightConeIngredients
  export default lightConeIngredients
}

declare module "~/assets/data/materials.csv" {
  import type { Material } from "~/types/data/materials"

  const materials: Material[]
  export default materials
}

declare module "assets/data/relic-sets.csv" {
  import type { RelicSet } from "~/types/data/relics"

  const relicSets: RelicSet[]
  export default relicSets
}

declare module "assets/data/relic-pieces.csv" {
  import type { RelicPiece } from "~/types/data/relics"

  const relicPieces: RelicPiece[]
  export default relicPieces
}

declare module "assets/data/relic-stats.yaml" {
  import type { RelicStats } from "~/types/generated/relic-stats.g"

  const relicStats: RelicStats
  export default relicStats
}

declare module "assets/data/drop-rates.yaml" {
  import type { DropRates } from "~/types/generated/drop-rates.g"

  const dropRates: DropRates
  export default dropRates
}
