declare module "~/assets/data/release-notes.yaml" {
  import {ReleaseNotes} from "~/types/generated/release-notes.g"
  const releaseNotes: ReleaseNotes
  export default releaseNotes
}

declare module "~/assets/data/characters.yaml" {
  import {Characters} from "~/types/generated/characters.g"
  const characters: Characters
  export default characters
}

declare module "~/assets/data/character-ingredients.yaml" {
  import {CharacterIngredients} from "~/types/generated/character-ingredients.g"
  const characterIngredients: CharacterIngredients
  export default characterIngredients
}

declare module "~/assets/data/light-cones.yaml" {
  import {LightCone} from "~/types/generated/light-cones.g"
  const lightCones: (LightCone & Record<string, unknown>)[]
  export default lightCones
}

declare module "~/assets/data/light-cone-ingredients.yaml" {
  import {LightConeIngredients} from "~/types/generated/light-cone-ingredients.g"
  const lightConeIngredients: LightConeIngredients
  export default lightConeIngredients
}

declare module "~/assets/data/materials.csv" {
  import {Material} from "~/types/data/materials"
  const materials: Material[]
  export default materials
}
