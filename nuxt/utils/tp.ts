import {DateTime, Duration} from "luxon"

const maxTpCount = 180
const singleTpReplenishmentTime = 6

export const getTpFullReplenishmentTime = (tpCount: number, baseTime: DateTime): DateTime | null => {
  if (tpCount >= maxTpCount || tpCount < 0) { return null }

  return baseTime.plus({minutes: (maxTpCount - tpCount) * singleTpReplenishmentTime})
}

export const getTpReplenishmentRemainingTime = (tpCount: number, baseTime: DateTime): Duration | null => {
  const diff = getTpFullReplenishmentTime(tpCount, baseTime)?.diffNow()
  if (!diff || diff.milliseconds < 0) { return null }

  return diff
}

export const getRealtimeTpCount = (tpCount: number, baseTime: DateTime): number => {
  const diff = baseTime.diffNow().shiftTo("minutes")
  return Math.min(maxTpCount, tpCount + Math.floor(-diff.minutes / singleTpReplenishmentTime))
}
