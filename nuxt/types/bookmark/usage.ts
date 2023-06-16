import {PurposeType} from "~/types/strings"
import {Path} from "~/types/generated/characters.g"

export type Usage = Usage.Character | Usage.LightCone | Usage.Exp

export namespace Usage {
  export interface Character {
    type: "character"
    characterId: string
    variant: Path | null
    purposeType: PurposeType
    upperLevel: number
  }

  export interface LightCone {
    type: "light_cone"
    characterId: string
    lightConeId: string
    purposeType: PurposeType & "ascension"
    upperLevel: number
  }

  export interface Exp {
    type: "exp"
    characterId: string
    lightConeId?: string
    upperLevel: number
  }
}
