declare module "#data/release-notes.yaml" {
  import {ReleaseNotes} from "~/types/generated/release-notes.g"
  const releaseNotes: ReleaseNotes
  export default releaseNotes
}

declare module "#data/characters.yaml" {
  import {Characters} from "~/types/generated/characters.g"
  const characters: Characters
  export default characters
}

declare module "#data/character-ingredients.yaml" {
  import {CharacterIngredients} from "~/types/generated/character-ingredients.g"
  const characterIngredients: CharacterIngredients
  export default characterIngredients
}

declare module "#data/light-cones.yaml" {
  import {LightCone} from "~/types/generated/light-cones.g"
  const lightCones: (LightCone & Record<string, unknown>)[]
  export default lightCones
}

declare module "#data/light-cone-ingredients.yaml" {
  import {LightConeIngredients} from "~/types/generated/light-cone-ingredients.g"
  const lightConeIngredients: LightConeIngredients
  export default lightConeIngredients
}

declare module "#data/materials.csv" {
  import {Material} from "~/types/data/materials"
  const materials: Material[]
  export default materials
}

declare module "#data/relic-sets.csv" {
  import {RelicSet} from "~/types/data/relics"
  const relicSets: RelicSet[]
  export default relicSets
}

declare module "#data/relic-pieces.csv" {
  import {RelicPiece} from "~/types/data/relics"
  const relicPieces: RelicPiece[]
  export default relicPieces
}

declare module "#data/relic-stats.yaml" {
  import {RelicStats} from "~/types/generated/relic-stats.g"
  const relicStats: RelicStats
  export default relicStats
}
