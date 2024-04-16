import type {PurposeType} from "~/types/strings"

export type Usage = Usage.Character | Usage.LightCone | Usage.Exp

export namespace Usage {
  export interface Character {
    type: "character"
    purposeType: PurposeType
    upperLevel: number
  }

  export interface LightCone {
    type: "light_cone"
    lightConeId: string
    purposeType: PurposeType & "ascension"
    upperLevel: number
  }

  export interface Exp {
    type: "exp"
    lightConeId: string | null
    purposeType: PurposeType & "ascension"
    upperLevel: number
  }
}
