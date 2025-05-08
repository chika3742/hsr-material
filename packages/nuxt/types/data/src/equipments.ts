import type { HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredient"
import type { LocalizedText } from "../locales"

interface EquipmentBase extends Record<string, unknown> {
  id: string
  name: LocalizedText
  yomi: string
  rarity: number
  materials: Record<string, MaterialExpr>
}

export interface LightCone extends EquipmentBase {
  path: HsrPath
}

export type Equipment = LightCone

export type Equipments = Equipment[]
