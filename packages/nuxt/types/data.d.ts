declare module "~/assets/data/release-notes.yaml" {
  import type { ReleaseNotesEntry } from "~/types/data/src/release-notes"

  const releaseNotes: ReleaseNotesEntry[]
  export default releaseNotes
}

declare module "~/assets/data/characters.yaml" {
  import type { HsrCharacter } from "~/types/data/src/characters"

  const hCharacters: HsrCharacter[]
  export default hCharacters
}

declare module "~/assets/data/character-ingredients.yaml" {
  import type { Ingredients } from "~/types/data/src/ingredients"

  const characterIngredients: Ingredients
  export default characterIngredients
}

declare module "~/assets/data/light-cones.yaml" {
  import type { LightCone } from "~/types/data/src/equipments"

  const lightCones: LightCone[]
  export default lightCones
}

declare module "~/assets/data/light-cone-ingredients.yaml" {
  import type { Ingredients } from "~/types/data/src/ingredients"

  const lightConeIngredients: Ingredients
  export default lightConeIngredients
}

declare module "~/assets/data/materials.yaml" {
  import type { Material } from "~/types/data/src/materials"

  const materials: Material[]
  export default materials
}

declare module "~/assets/data/materials-meta.yaml" {
  import type { MaterialsMeta } from "~/types/data/src/materials-meta"

  const materialsMeta: MaterialsMeta
  export default materialsMeta
}

declare module "assets/data/relic-sets.yaml" {
  import type { RelicSet } from "~/types/data/src/decoration-sets"

  const relicSets: RelicSet[]
  export default relicSets
}

declare module "assets/data/relic-pieces.yaml" {
  import type { RelicPiece } from "~/types/data/src/decoration-pieces"

  const relicPieces: RelicPiece[]
  export default relicPieces
}

declare module "assets/data/relic-stats.yaml" {
  import type { HsrRelicStats } from "~/types/data/src/decoration-stats"

  const relicStats: HsrRelicStats
  export default relicStats
}

declare module "assets/data/drop-rates.yaml" {
  import type { DropRates } from "~/types/data/src/drop-rates"

  const dropRates: DropRates
  export default dropRates
}

declare module "~/assets/data/genshin/characters.yaml" {
  import type { GenshinCharacter } from "~/types/data/src/characters"

  const gCharacters: GenshinCharacter[]
  export default gCharacters
}

declare module "~/assets/data/genshin/character-ingredients.yaml" {
  import type { Ingredients } from "~/types/data/src/ingredients"

  const gCharacterIngredients: Ingredients
  export default gCharacterIngredients
}

declare module "~/assets/data/genshin/materials.yaml" {
  import type { Material } from "~/types/data/src/materials"

  const gMaterials: Material[]
  export default gMaterials
}

declare module "~/assets/data/genshin/materials-meta.yaml" {
  import type { MaterialsMeta } from "~/types/data/src/materials-meta"

  const gMaterialsMeta: MaterialsMeta[]
  export default gMaterialsMeta
}
