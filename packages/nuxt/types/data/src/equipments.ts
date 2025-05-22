import type { HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredient"
import type { LocalizedText } from "../locales"

interface EquipmentBase {
  id: string
  name: LocalizedText
  yomi: string
  rarity: number
  skillDescription: LocalizedText
  materials: Record<string, MaterialExpr>
}

export interface LightCone extends EquipmentBase {
  path: HsrPath
}

export type Equipment = LightCone

export type Equipments = Equipment[]
