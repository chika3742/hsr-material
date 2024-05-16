import type {DateTime, Duration} from "luxon"

export const maxTpCount = 240
const singleTpReplenishMinute = 6
const reserveTpReplenishMinute = 18

export const getTpFullReplenishmentTime = (tpCount: number, baseTime: DateTime): DateTime | null => {
  if (tpCount >= maxTpCount || tpCount < 0) { return null }

  return baseTime.plus({minutes: (maxTpCount - tpCount) * singleTpReplenishMinute})
}

export const getTpReplenishmentRemainingTime = (tpCount: number, baseTime: DateTime): Duration | null => {
  const diff = getTpFullReplenishmentTime(tpCount, baseTime)?.diffNow()
  if (!diff || diff.milliseconds < 0) { return null }

  return diff
}

export const getRealtimeTpCount = (tpCount: number, baseTime: DateTime): number => {
  const diff = baseTime.diffNow().shiftTo("minutes")
  return Math.min(maxTpCount, tpCount + Math.floor(-diff.minutes / singleTpReplenishMinute))
}

export const getReservedTpCount = (tpCount: number, baseTime: DateTime): number | null => {
  const tpFullReplenishmentTime = getTpFullReplenishmentTime(tpCount, baseTime)
  if (!tpFullReplenishmentTime) { return null }

  const diff = tpFullReplenishmentTime.diffNow().shiftTo("minutes")
  return Math.max(0, Math.floor(-diff.minutes / reserveTpReplenishMinute)) || null
}
