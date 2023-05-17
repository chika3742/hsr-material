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

declare module "~/assets/data/materials.csv" {
  import {Material} from "~/types/data/materials"
  const materials: Material[]
  export default materials
}
