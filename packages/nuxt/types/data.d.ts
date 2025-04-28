declare module "~/assets/data/release-notes.yaml" {
  const releaseNotes: ReleaseNotes
  export default releaseNotes
}

declare module "~/assets/data/characters.yaml" {
  import type { Characters } from "~/types/data/src/characters"

  const characters: Characters
  export default characters
}

declare module "~/assets/data/character-ingredients.yaml" {
  import type { Ingredients } from "~/types/data/src/ingredients"

  const characterIngredients: Ingredients
  export default characterIngredients
}

declare module "~/assets/data/light-cones.yaml" {
  import type { Equipments } from "~/types/data/src/equipments"

  const lightCones: Equipments
  export default lightCones
}

declare module "~/assets/data/light-cone-ingredients.yaml" {
  import type { Ingredients } from "~/types/data/src/ingredients"

  const lightConeIngredients: Ingredients
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
  import type { DecorationStats } from "~/types/data/src/decoration-stats"

  const relicStats: DecorationStats
  export default relicStats
}

declare module "assets/data/drop-rates.yaml" {
  import type { DropRates } from "~/types/data/src/drop-rates"

  const dropRates: DropRates
  export default dropRates
}
