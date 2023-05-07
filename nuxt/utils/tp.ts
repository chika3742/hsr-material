import {DateTime, Duration} from "luxon"

const maxTpCount = 180
const singleTpReplenishmentTime = 6

export const getTpFullReplenishmentTime = (tpCount: number, baseTime: DateTime): DateTime | null => {
  if (tpCount >= maxTpCount || tpCount < 0) { return null }

  const added = baseTime.plus({minutes: (maxTpCount - tpCount) * singleTpReplenishmentTime})
  if (added.diffNow().milliseconds < 0) { return null }

  return added
}

export const getTpReplenishmentRemainingTime = (tpCount: number, baseTime: DateTime): Duration | null => {
  const tpFullReplenishmentTime = getTpFullReplenishmentTime(tpCount, baseTime)
  if (tpFullReplenishmentTime === null) { return null }

  return tpFullReplenishmentTime.diffNow()
}

export const getRealtimeTpCount = (tpCount: number, baseTime: DateTime): number => {
  const diff = baseTime.diffNow().shiftTo("minutes")
  return tpCount + Math.floor(-diff.minutes / singleTpReplenishmentTime)
}
