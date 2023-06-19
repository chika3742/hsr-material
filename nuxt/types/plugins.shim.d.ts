declare module "@vue/runtime-core" {
  import {VSelectCharacter} from "~/utils/to-variant-separated-characters";

  export interface ComponentCustomProperties {
    $vSelectCharacters: VSelectCharacter[]
  }
}

export {}