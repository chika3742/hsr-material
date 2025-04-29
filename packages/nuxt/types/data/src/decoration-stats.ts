import type { HsrRelicPosition, HsrStat } from "../enums"

export interface DecorationStatsBase<TPos extends string = string, TStat extends string = string> {
  main: Record<TPos, TStat[]>
  sub: TStat[]
}

export type HsrRelicStats = DecorationStatsBase<HsrRelicPosition, HsrStat>

export type DecorationStats = HsrRelicStats
