import type { HsrPath } from "../enums"
import type { MaterialExpr } from "../ingredient"

interface EquipmentBase {
  id: string
  $nameJA: string
  yomi: string
  rarity: number
  materials: Record<string, MaterialExpr>
}

export interface LightCone extends EquipmentBase {
  path: HsrPath
}

export type Equipment = LightCone

export type Equipments = Equipment[]
