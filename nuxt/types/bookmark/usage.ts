import {PurposeType} from "~/types/strings"

export type Usage = Usage.Character | Usage.LightCone | Usage.Exp

export namespace Usage {
  export interface Character {
    type: "character"
    characterId: string
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
